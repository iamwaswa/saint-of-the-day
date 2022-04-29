import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useEffect } from "react";
import { strings } from "~/localization";
import { Scraper } from "~/packages";
import { sendNotificationAsync } from "~/utils";

interface ISaintOfTheDay {
  introduction: string;
  name: string;
  readMoreLink: string;
}

type WithImageProperties<TypeWithoutImageProperties> =
  TypeWithoutImageProperties & {
    imageProperties: {
      height: number;
      src: string;
      width: number;
    };
  };

interface IIndexPageLoaderData {
  saintOfTheDay: WithImageProperties<ISaintOfTheDay>;
}

export const loader: LoaderFunction = async ({ request }) => {
  let response: Response | undefined = undefined;

  const browser = await Scraper.launch({
    headless: process.env.NODE_ENV !== `development`,
  });
  const page = await browser.newPage();
  await page.goto(`https://www.catholic.org/saints/sofd.php`);
  const linksToContinueReading = await page.$x(
    `//a[contains(., 'continue reading')]`
  );

  if (linksToContinueReading.length > 0) {
    const [firstLinkToContinueReading] = linksToContinueReading;
    const linkToSaintOfTheDayFullInfo = await (
      await firstLinkToContinueReading.getProperty(`href`)
    ).jsonValue<string>();
    await page.goto(linkToSaintOfTheDayFullInfo);

    const readMoreAction = await page.$(`#wikiReadMore`);

    if (readMoreAction) {
      await readMoreAction.click();

      const name = await page.$eval(`h1`, (element) => {
        if (element instanceof HTMLHeadingElement) {
          return element.textContent;
        }
      });

      const imageProperties = await page.$eval(
        `#saintContent > img`,
        (element) => {
          if (element instanceof HTMLImageElement) {
            const boundingClientRect = element.getBoundingClientRect();

            return {
              height: Math.round(boundingClientRect.height),
              src: element.src,
              width: Math.round(boundingClientRect.width),
            };
          }
        }
      );

      const introduction = await page.$eval(`#saintContent > p`, (element) => {
        return element.textContent;
      });

      if (imageProperties && introduction && name) {
        const saintOfTheDay = {
          imageProperties,
          introduction,
          name,
          readMoreLink: linkToSaintOfTheDayFullInfo,
        };

        response = json<IIndexPageLoaderData>({
          saintOfTheDay,
        });
      }
    }
  }

  await browser.close();

  if (!response) {
    throw new Response(strings.internalServerErrorTitle, {
      status: 500,
      statusText: strings.internalServerErrorMessage,
    });
  }

  return response;
};

export const meta: MetaFunction = () => ({
  description: strings.homePageDescription,
  title: strings.homePageTitle,
});

export default function IndexPage() {
  const loaderData = useLoaderData<IIndexPageLoaderData>();

  useEffect((): void => {
    sendNotificationAsync(`Saint Of The Day`, {
      body: `There is a new saint of the day!`,
      silent: false,
    });
  }, []);

  return (
    <main className="flex min-h-full flex-col items-center p-8">
      <section className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-8">
        <h1 className="text-center text-4xl font-bold">
          {loaderData.saintOfTheDay.name}
        </h1>
        <img
          alt={loaderData.saintOfTheDay.name}
          className={`aspect-[${loaderData.saintOfTheDay.imageProperties.width}/${loaderData.saintOfTheDay.imageProperties.height}] w-full rounded-sm`}
          src={loaderData.saintOfTheDay.imageProperties.src}
        />
        <p className="text-center text-lg" title="introduction">
          {loaderData.saintOfTheDay.introduction}
        </p>
        <a
          className="mt-4 text-center no-underline hover:underline"
          href={loaderData.saintOfTheDay.readMoreLink}
          rel="noopener noreferrer"
          target="_blank"
        >
          {strings.readMoreActionText}
        </a>
      </section>
    </main>
  );
}
