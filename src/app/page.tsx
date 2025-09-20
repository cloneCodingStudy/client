import Image from "next/image";
import Link from "next/link";
import {
  HomeIcon,
  UserIcon,
  HeartIcon,
  TicketIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  ChevronRightIcon,
  StarIcon,
  TvIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  const categories = [
    { icon: HomeIcon, label: "생활용품", href: "/category/lifestyle" },
    { icon: UserIcon, label: "의류/잡화", href: "/category/beauty" },
    { icon: HeartIcon, label: "육아", href: "/category/childcare" },
    { icon: TicketIcon, label: "레저/취미", href: "/category/leisure" },
    { icon: HeartIcon, label: "반려동물", href: "/category/pet" },
    { icon: TruckIcon, label: "자동차/정비", href: "/category/car" },
    { icon: TvIcon, label: "전자기기", href: "/category/car" },
    { icon: WrenchScrewdriverIcon, label: "수리/공구/인테리어", href: "/category/repair" },
  ];

  const featuredProjects = [
    {
      id: 1,
      title: "아파트 베란다 인테리어 공구 빌려주세요",
      location: "성북구 성북동",
      price: "50,000원",
      rating: 4.8,
      reviews: 12,
      tags: ["인테리어", "베란다"],
      image: "/images/공구.jpg",
    },
    {
      id: 2,
      title: "아파트 베란다 인테리어 공구 빌려주세요",
      location: "성북구 동선동",
      price: "30,000원",
      rating: 4.9,
      reviews: 24,
      tags: ["인테리어", "베란다"],
      image: "/images/공구.jpg",
    },
    {
      id: 3,
      title: "아파트 베란다 인테리어 공구 빌려주세요",
      location: "성북구 삼선동",
      price: "80,000원",
      rating: 5.0,
      reviews: 8,
      tags: ["인테리어", "베란다"],
      image: "/images/공구.jpg",
    },
    {
      id: 4,
      title: "아파트 베란다 인테리어 공구 빌려주세요",
      location: "성북구 성북동",
      price: "25,000원",
      rating: 4.7,
      reviews: 15,
      tags: ["인테리어", "베란다"],
      image: "/images/공구.jpg",
    },
  ];

  const recentActivity = [
    { date: "2024-03-15", title: "길 잃은 고양이 찾아드려요" },
    { date: "2024-03-14", title: "길 잃은 고양이 보셨나요?ㅜㅜ" },
    { date: "2024-03-15", title: "길 잃은 고양이 찾아드려요" },
    { date: "2024-03-14", title: "길 잃은 고양이 보셨나요?ㅜㅜ" },
  ];

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl">
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
          성북동에서 빔 프로젝터 찾고 계신가요?
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] mb-8">
          대여하고픈 모든 것을 검색해보세요
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="검색어를 입력해주세요"
            className="w-full px-6 py-4 text-lg border border-[var(--color-border)] rounded-full 
                     focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 
                     focus:ring-[var(--color-primary)]/20 bg-white shadow-sm"
          />
          <button
            className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 
                           bg-[var(--color-primary)] px-6 py-2 rounded-full 
                           hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            검색
          </button>
        </div>
      </section>

      {/* Category Section */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
          실시간 인기 검색어
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-8">#자전거 #캠핑의자 #유아용품</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="flex flex-col items-center p-6 bg-white rounded-xl border border-[var(--color-border)]
                       hover:shadow-md hover:bg-[#FAFAFF] transition-all duration-200 group"
            >
              <div
                className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center mb-3
                            group-hover:bg-[var(--color-primary)]/20 transition-colors"
              >
                <category.icon className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <span className="text-sm font-medium text-[var(--color-text-primary)] text-center">
                {category.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              우리 동네 인기 물건 빌려요
            </h2>
            <p className="text-[var(--color-text-secondary)] mt-1">
              내 근처에서 인기 있는 다양한 물건을 바로 대여 하세요.
            </p>
          </div>
          <Link
            href="/projects"
            className="flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] 
                     font-medium transition-colors"
          >
            더보기 <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden
                       hover:shadow-lg transition-shadow duration-200"
            >
              <div className="relative h-40 bg-gray-200">
                <Image src={project.image} alt={project.title} fill className="object-cover" />
                <div className="absolute top-3 right-3">
                  <span
                    className="bg-[var(--color-highlight)] text-[var(--color-text-primary)] 
                                 px-2 py-1 text-xs font-medium rounded-full"
                  >
                    NEW
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-2 line-clamp-2">
                  {project.title}
                </h3>

                <div className="flex items-center text-sm text-[var(--color-text-secondary)] mb-2">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {project.location}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium ml-1">{project.rating}</span>
                    <span className="text-sm text-[var(--color-text-secondary)] ml-1">
                      ({project.reviews})
                    </span>
                  </div>
                  <span className="text-[var(--color-primary)] font-bold">{project.price}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] 
                               text-xs px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">커뮤니티</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">
          이웃들과의 실시간 소통, 후기 공유, 꿀팁 등 커뮤니티 소식을 간편하게 확인하세요.
        </p>

        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b 
                                        border-[var(--color-border)] last:border-b-0"
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[var(--color-success)] rounded-full mr-3"></div>
                  <span className="text-[var(--color-text-primary)]">{activity.title}</span>
                </div>
                <span className="text-sm text-[var(--color-text-secondary)]">{activity.date}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link
              href="/community"
              className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] 
                        rounded-full hover:bg-[var(--color-primary-hover)] 
                       transition-colors font-medium"
            >
              커뮤니티 더보기
            </Link>
          </div>
        </div>
      </section>

      <section className="text-center py-12 bg-[var(--color-primary)] rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">쉐어링으로 지속 가능한 소비</h2>
        <p className="text-[var(--color-primary-purple)] text-lg mb-8">
          빌려요는 쉐어링을 통해
          <br />
          모두가 더 나은 세상을 만듭니다.
          <br />
          함께 실천해요.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-8 py-4 bg-white text-[var(--color-primary)] 
                   rounded-full font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg"
        >
          내 물건 빌려주기
        </Link>
      </section>
    </div>
  );
}
