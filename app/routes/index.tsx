import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useEffect } from "react";
import { strings } from "~/localization";
import { parseDOMFromHtmlString, serverFetch } from "~/packages";
import { sendNotificationAsync } from "~/utils";

interface ISaintOfTheDay {
  introduction: string;
  name: string;
  readMoreLink: string;
}

type WithImageProperties<TypeWithoutImageProperties> =
  TypeWithoutImageProperties & {
    imageProperties: {
      src: string;
    };
  };

interface IIndexPageLoaderData {
  saintOfTheDay: WithImageProperties<ISaintOfTheDay>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const baseURL = `https://www.catholic.org`;

  const page = await serverFetch(`${baseURL}/saints/sofd.php`, {
    headers: {
      [`Content-Type`]: `text/html`,
    },
  });

  const html = await page.text();

  const document = parseDOMFromHtmlString(html);

  const container = document.getElementById(`saintsSofd`);

  const links = container?.getElementsByTagName(`a`);

  if (links && links.length > 0) {
    const [fullContentLink] = links;

    const fullContentURL = fullContentLink.getAttribute(`href`);

    if (fullContentURL) {
      const readMoreLink = `${baseURL}${fullContentURL}`;

      const fullPage = await serverFetch(readMoreLink);

      const fullHtml = await fullPage.text();

      const fullDocument = parseDOMFromHtmlString(fullHtml);

      const titleElements = fullDocument.getElementsByTagName(`h1`);

      if (titleElements && titleElements.length > 0) {
        const [titleElement] = titleElements;
        const name = titleElement.textContent;

        const saintContent = fullDocument.getElementById(`saintContent`);

        if (saintContent) {
          const images = saintContent.getElementsByTagName(`img`);

          if (images && images.length > 0) {
            const [image] = images;

            const src = image.getAttribute(`data-src`);

            if (src) {
              const imageProperties = {
                src: `${baseURL}${src}`,
              };

              const saintContentText = saintContent.getElementsByTagName(`p`);

              if (saintContentText && saintContentText.length > 0) {
                const [paragraph] = saintContentText;
                const introduction = paragraph.textContent;

                return json<IIndexPageLoaderData>({
                  saintOfTheDay: {
                    imageProperties,
                    introduction,
                    name,
                    readMoreLink,
                  },
                });
              }
            }
          }
        }
      }
    }
  }

  throw new Response(strings.internalServerErrorTitle, {
    status: 500,
    statusText: strings.internalServerErrorMessage,
  });
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
          className="aspect-auto w-full rounded-sm object-cover"
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
