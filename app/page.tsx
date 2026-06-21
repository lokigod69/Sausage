import { redirect } from "next/navigation";

const PANGLAO_PATH = process.env.NEXT_PUBLIC_PANGLAO_PATH || "/panglao";

/**
 * The root currently serves the single Panglao branch. When more branches
 * exist, this can become a branch picker instead of a redirect.
 */
export default function RootPage() {
  redirect(PANGLAO_PATH);
}
