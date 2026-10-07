import { useState } from "react"

const defaultSocialLinks = [
  { href: '#discord', label: 'Discord', symbol: '●' },
  { href: '#community', label: 'Community', symbol: '▲' },
  { href: '#twitter', label: 'Twitter', symbol: '♥' },
]

export function SceneNavigation({
  socialLinks = defaultSocialLinks,
  collectionHref = '#collection',
  collectionLabel = 'view collection'
}) {
    const [collectionOpen, setCollectionOpen]= useState(false)
  
  return (
    <>
      <nav
        className="social-links absolute bottom-[clamp(20px,3vw,48px)] left-[clamp(20px,3vw,56px)] z-[45] flex gap-3.5 max-[620px]:gap-2"
        aria-label="Social links"
      >
        {socialLinks.map(({ href, label, symbol }) => (
          <a
            className="grid size-[46px] place-items-center rounded-full bg-[#2c64d5] text-white no-underline shadow-[0_5px_16px_rgba(24,59,144,.2)] transition-[transform,background-color] duration-200 hover:-translate-y-1 hover:bg-[#1f45a5] focus-visible:-translate-y-1 focus-visible:bg-[#1f45a5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2446a4] motion-reduce:transition-none max-[620px]:size-[38px] max-[620px]:text-[.8rem]"
            href={href}
            aria-label={label}
            key={label}
          >
            {symbol}
          </a>
        ))}
      </nav>

      <button
        className="collection-link absolute right-0 bottom-0 z-[45] min-w-[clamp(210px,20vw,320px)] rounded-tl-[52%] bg-[#2446a4] px-9 pt-[38px] pb-[31px] text-right text-[.82rem] font-semibold tracking-[.32em] text-white no-underline transition-[transform,background-color] duration-200 hover:-translate-y-1 hover:bg-[#1f3c8f] focus-visible:-translate-y-1 focus-visible:bg-[#1f3c8f] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white motion-reduce:transition-none max-[620px]:min-w-[170px] max-[620px]:px-[18px] max-[620px]:pt-7 max-[620px]:pb-[22px] max-[620px]:text-[.66rem]"
        // href={collectionHref}
        onClick={()=>setCollectionOpen(true)}
      >
        {collectionLabel}
      </button>

       {/* {collectionOpen && ( */}
        <aside
          className={`fixed top-0 right-0 z-50 h-full transition-transform duration-300 ${collectionOpen? 'translate-x-0':'translate-x-full'}`}
        >
          <div
            className="relative max-h-[80vh] w-full max-w-3xl
              overflow-y-auto rounded-3xl bg-white p-8"
          >
            <button
              type="button"
              onClick={() => setCollectionOpen(false)}
              className="absolute top-5 right-5 grid size-10
                place-items-center rounded-full bg-blue-800
                text-xl text-white"
            >
              ×
            </button>

            <h2 className="mb-6 text-4xl font-bold text-blue-800">
              Paw Collection
            </h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {/* {Array.from({ length: 16 }, (_, index) => ( */}
                {(()=>{
                  const item =[]
                  for(let index = 0; index<16; index++){
                  item.push(
                  <div
                  key={index}
                  className="rounded-2xl bg-white p-3 shadow"
                >
                  <img
                    src={`/floating_animation/img${index + 1}.webp`}
                    alt={`Paw character ${index + 1}`}
                    className="aspect-square w-full object-contain"
                  />
                </div>)
                }
                return item;
                })()}
              {/* ))} */}
            </div>
          </div>
        </aside>
      {/* )} */}
    </>
  )
}
