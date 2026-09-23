import FAQForm from "@/components/admin/faqs/FAQForm";

export const dynamic = "force-dynamic";

export default function NewFAQPage() {
  return (
    <main className="min-h-screen bg-[#061A2B]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#FFD400]">
            FAQ Management
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Create FAQ
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8BBC8]">
            Create a useful customer question,
            connect it with relevant services and
            service areas, then choose its publishing
            status.
          </p>
        </div>

        <FAQForm mode="create" />
      </div>
    </main>
  );
}