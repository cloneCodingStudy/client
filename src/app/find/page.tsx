import FindForm from "@/components/domain/auth/findForm";

export default function FindPage() {
  return (
    <>
      <h3 className="font-basic text-md md:text-xl lg:text-2xl text-button-color pt-12 md:pt-16 lg:pt-24 text-center px-4">
        이메일/비밀번호 찾기
      </h3>
      <div className="border-2 mt-6 md:mt-8 mx-4 md:mx-auto max-w-[46.25rem] rounded-2xl md:rounded-4xl border-button-color-opaque-25 px-6 py-12 md:px-12 lg:px-20 md:py-16 lg:py-24">
        <FindForm />
      </div>
    </>
  );
}
