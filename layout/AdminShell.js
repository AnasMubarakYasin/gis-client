import Page from "@/layout/Page";
import Authenticate from "@/layout/Authenticate";
import NewAdmin from "@/layout/NewAdmin";

export default function getLayout(page) {
  return (
    <Authenticate>
      <Page animate>
        <NewAdmin>{page}</NewAdmin>
      </Page>
    </Authenticate>
  );
}
