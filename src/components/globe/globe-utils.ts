// The 3D label font bundled with three-globe (Helvetiker) lacks most accented
// Latin glyphs, and three.js silently drops missing characters ("Malmö" renders
// as "Malm"). Fold diacritics for the 3D label only; HTML text keeps the real name.
export const toGlobeLabelText = (cityName: string): string =>
    cityName.normalize("NFD").replace(/\p{Diacritic}/gu, "");
