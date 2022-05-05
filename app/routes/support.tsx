import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { ToggleTheme } from "~/components";
import { getIsDarkModeSessionAsync } from "~/utils";

interface IPrivacyPolicyRouteLoaderData {
  isDarkMode: boolean;
}

export const loader: LoaderFunction = async ({ request }) => {
  const isDarkModeSession = await getIsDarkModeSessionAsync(request);

  return json<IPrivacyPolicyRouteLoaderData>({
    isDarkMode: Boolean(isDarkModeSession.get()),
  });
};

export default function SupportPage() {
  const loaderData = useLoaderData<IPrivacyPolicyRouteLoaderData>();

  const textClassName = `text-center text-slate-800 dark:text-slate-50`;
  const subtitleClassName = `${textClassName} font-semibold text-center text-2xl`;
  const paragraphClassName = `${textClassName} text-lg`;
  const sectionClassName = `flex flex-col gap-2`;

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col items-center gap-10 p-8">
      <ToggleTheme
        isDarkMode={loaderData.isDarkMode}
        redirectToOnToggle="/support"
      />
      <h1 className={`${textClassName} text-4xl font-bold`}>Support</h1>
      <section className={sectionClassName}>
        <h2 className={subtitleClassName}>Contact Information</h2>
        <p className={paragraphClassName}>
          In the event that there are any issues with the application, please
          free to contact the developer at{" "}
          <a href="mailto:olungaw@gmail.com?Subject=Saint Of The Day App Support">
            olungaw@gmail.com
          </a>
        </p>
      </section>
    </main>
  );
}
