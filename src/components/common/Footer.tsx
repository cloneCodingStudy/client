import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--color-footer-bg)]  text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex justify-between">
          <div className="space-y-3 text-sm leading-relaxed">
            <h1 className="text-3xl font-bold font-logo text-[var(--color-primary-purple)]">
              Billioyo
            </h1>
            <p>(주) 프로젝트 빌려요 | 대표 팀빌려요</p>
            <p>주소 : 서울 광진구 자양동 뚝섬한강공원</p>
            <p>고객센터 : 1234-5678 | cs@billioyo.com</p>
          </div>

          <div className="flex items-start space-x-4">
            <a href="https://www.instagram.com/">
              <Image src={"/icon/instagram.svg"} alt="Instagram" height={24} width={24} />
            </a>
            <a href="https://www.youtube.com/">
              <Image src={"/icon/youtube.svg"} alt="youtube" height={24} width={24} />
            </a>
          </div>
        </div>

        <div className="pt-4 mt-4 text-xs text-[var(--color-text-tertiary)]">
          Copyright © {new Date().getFullYear()} billioyo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
