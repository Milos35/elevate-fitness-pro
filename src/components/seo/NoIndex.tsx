import { Helmet } from "react-helmet-async";

/** Keeps member and admin screens out of search results. Renders nothing visible. */
export function NoIndex() {
  return (
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );
}
