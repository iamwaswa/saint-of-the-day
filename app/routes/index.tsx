import { useLoaderData } from "@remix-run/react";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { ToggleTheme } from "~/components";
import { strings } from "~/localization";
import { parseDOMFromHtmlString, serverFetch } from "~/packages";
import { getIsDarkModeSessionAsync } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const isDarkMode = formData.get(`isDarkMode`);

  const redirectTo = formData.get(`redirectTo`);

  if (typeof isDarkMode === `string` && typeof redirectTo === `string`) {
    const isDarkModeSession = await getIsDarkModeSessionAsync(request);

    isDarkModeSession.set(isDarkMode?.toLowerCase() === `true`);

    return redirect(redirectTo, {
      headers: { [`Set-Cookie`]: await isDarkModeSession.commitAsync() },
    });
  }

  return redirect(`/`);
};

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

interface IIndexRouteLoaderData {
  isDarkMode: boolean;
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

                const isDarkModeSession = await getIsDarkModeSessionAsync(
                  request
                );

                return json<IIndexRouteLoaderData>({
                  isDarkMode: Boolean(isDarkModeSession.get()),
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
  const loaderData = useLoaderData<IIndexRouteLoaderData>();

  return (
    <main className="flex min-h-full flex-col items-center p-8">
      <section className="mx-auto flex min-h-full w-full max-w-3xl flex-col items-center gap-8">
        <ToggleTheme
          isDarkMode={loaderData.isDarkMode}
          redirectToOnToggle="/"
        />
        <h1 className="text-center text-4xl font-bold text-slate-800 dark:text-slate-50">
          {loaderData.saintOfTheDay.name}
        </h1>
        <section className="relative w-full bg-slate-50 dark:bg-slate-800">
          <img
            alt={loaderData.saintOfTheDay.name}
            className="aspect-auto w-full rounded-md object-cover"
            src={loaderData.saintOfTheDay.imageProperties.src}
          />
        </section>
        <p
          className="text-center text-lg text-slate-800 dark:text-slate-50"
          title="introduction"
        >
          {loaderData.saintOfTheDay.introduction}
        </p>
        <a
          className="mt-4 self-center rounded-md bg-slate-800 py-2 px-4 text-center text-slate-50 no-underline outline-slate-400 hover:opacity-90 focus:opacity-90 dark:bg-slate-50 dark:text-slate-800 dark:outline-slate-800"
          href={loaderData.saintOfTheDay.readMoreLink}
          rel="noopener noreferrer"
          target="_blank"
          title="Read more"
        >
          {strings.readMoreActionText}
        </a>
      </section>
    </main>
  );
}
