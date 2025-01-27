export const getOptimizedUrl = (url: string): { mainUrl: string; secondaryUrl: string } => {
  return {
    mainUrl: url.replace(
      "/upload/",
      `/upload/q_auto:best,dpr_2,f_auto,w_1290,h_1290,c_crop,g_auto/`
    ),
    secondaryUrl: url.replace(
      "/upload/",
      `/upload/q_auto:low,f_auto,w_400,h_400,c_fill,g_auto/`
    ),
  };
};
