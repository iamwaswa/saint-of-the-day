import LocalizedStrings from "react-localization";

export const strings = new LocalizedStrings<ILocalizationStrings>({
  en: {
    darkModeTitle: `Dark mode`,
    homePageDescription: `An informational on the saint of the day`,
    homePageTitle: `Saint Of The Day`,
    internalServerErrorMessage: `Something went wrong parsing the Saint Of The Day, let the developer know!`,
    internalServerErrorTitle: `Internal Server Error`,
    readMoreActionText: `Read More`,
  },
});
