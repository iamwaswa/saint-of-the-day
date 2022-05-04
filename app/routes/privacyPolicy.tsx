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

export default function PrivacyPolicyPage() {
  const loaderData = useLoaderData<IPrivacyPolicyRouteLoaderData>();

  const textClassName = `text-center text-slate-800 dark:text-slate-50`;
  const subtitleClassName = `${textClassName} font-semibold text-center text-2xl`;
  const paragraphClassName = `${textClassName} text-lg`;
  const sectionClassName = `flex flex-col gap-2`;

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col items-center gap-10 p-8">
      <ToggleTheme
        isDarkMode={loaderData.isDarkMode}
        redirectToOnToggle="/privacyPolicy"
      />
      <h1 className={`${textClassName} text-4xl font-bold`}>Privacy Policy</h1>
      <section className={sectionClassName}>
        <h2 className={subtitleClassName}>Preamble</h2>
        <p className={paragraphClassName}>
          The Saint Of The Day app is committed to maintaining the accuracy,
          confidentiality and security of your personal information
        </p>
        <p className={paragraphClassName}>
          This privacy policy describes the personal information that the Saint
          Of The Day app collects from or about you, how we use that
          information, and to whom we disclose that information.
        </p>
      </section>
      <section className={sectionClassName}>
        <h2 className={subtitleClassName}>Collecting Personal Information</h2>
        <p className={paragraphClassName}>
          The Saint Of The Day app does not collect any personal information
          from you.
        </p>
      </section>
      <section className={sectionClassName}>
        <h2 className={subtitleClassName}>Personal Information Security</h2>
        <p className={paragraphClassName}>
          The Saint Of The Day app values your personal information. Part of
          valuing your personal information is making sure that it is protected
          and kept confidential. We achieve this by not collecting any of your
          personal information.
        </p>
      </section>
    </main>
  );
}
