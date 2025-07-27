import Stepper from "@/components/Stepper";
// import DashboardLayout from "../../dashboard/layout";

export default function GiftingPage() {
  return (
    <section className="pb-10 pt-10 dark:bg-black lg:pb-25 lg:pt-15 xl:pb-30 xl:pt-20">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div>
          <h1 className="my-8 text-center text-2xl font-bold">
            Gifting Process
          </h1>
          <Stepper />
        </div>
      </div>
    </section>
  );
}
