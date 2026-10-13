// TEMPORARILY DISABLED: the complete previous LikeSection implementation is preserved below as comments for rollback.
// import * as React from "react"
//
// import { Toggle } from "@/components/m3e/toggle"
// import { Icon } from "@/components/m3e/icon"
// import { cn } from "@/lib/m3e/cn"
// import { Reveal } from "./Reveal"
// import { fetchLikes, sendLike, type LikesSnapshot } from "@/lib/likes"
// import { SECTION_TITLES } from "@/config"
//
// /**
//  * Like button (M3 icon toggle: favorite, outlined → filled, aria-pressed) and
//  * the real public counter.
//  *
//  * The number always comes from the server. If the endpoint is unreachable the
//  * section says so honestly and offers a retry — it never shows a made-up
//  * count. localStorage only discourages repeat likes on this device.
//  */
// export function LikeSection() {
//   const [state, setState] = React.useState<LikesSnapshot>({
//     status: "loading",
//     count: null,
//     liked: false,
//   })
//   const [busy, setBusy] = React.useState(false)
//   const [liveMessage, setLiveMessage] = React.useState("")
//
//   const load = React.useCallback(async () => {
//     setState(await fetchLikes())
//   }, [])
//
//   React.useEffect(() => {
//     void load()
//   }, [load])
//
//   const onToggle = async () => {
//     if (busy || state.status !== "ready") return
//     setBusy(true)
//     const action = state.liked ? "unlike" : "like"
//     const next = await sendLike(action)
//     setBusy(false)
//     setState(next)
//     if (next.status === "ready") {
//       setLiveMessage(
//         action === "like" ? "تم تسجيل إعجابك" : "أُزيل إعجابك"
//       )
//     } else {
//       setLiveMessage("تعذّر الاتصال بعدّاد الإعجابات")
//     }
//   }
//
//   const unavailable = state.status === "unavailable"
//   const count =
//     state.status === "loading" || unavailable ? null : (state.count ?? 0)
//
//   return (
//     <section
//       id="like"
//       aria-labelledby="like-title"
//       className="mx-auto max-w-5xl scroll-mt-24 px-4 pb-16 sm:px-6"
//     >
//       <Reveal>
//         <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl bg-surface-container-low px-6 py-8 text-center">
//           <h2
//             id="like-title"
//             className="font-heading text-title-large font-semibold text-on-surface"
//           >
//             {SECTION_TITLES.like}
//           </h2>
//
//           <Toggle
//             className="like-toggle size-14 rounded-full"
//             aria-pressed={state.liked}
//             aria-label="أضِف إعجاباً بصفحة الشارع"
//             disabled={busy || state.status !== "ready"}
//             onClick={onToggle}
//           >
//             <Icon name="favorite" size={28} fill="auto" />
//           </Toggle>
//
//           <p className="min-h-8 font-heading text-title-large font-semibold text-on-surface" aria-live="off">
//             {count === null ? (
//               <span
//                 className={cn(
//                   "inline-block h-8 w-16 rounded-sm bg-on-surface/10 align-middle",
//                   busy && "animate-pulse"
//                 )}
//               />
//             ) : (
//               <>
//                 <span dir="ltr">{count.toLocaleString("en-US")}</span>
//                 <span className="ms-2 text-body-medium font-normal text-on-surface-variant">
//                   إعجاب
//                 </span>
//               </>
//             )}
//           </p>
//
//           <div aria-live="polite" className="sr-only">
//             {liveMessage}
//           </div>
//
//           {unavailable ? (
//             <>
//               <p className="font-body-ar text-body-small text-on-surface-variant">
//                 عدّاد الإعجابات غير متاح حالياً.
//               </p>
//               <button
//                 type="button"
//                 onClick={() => void load()}
//                 className="cursor-pointer rounded-full bg-transparent px-4 py-2 text-label-large text-primary outline-none focus-ring"
//               >
//                 إعادة المحاولة
//               </button>
//             </>
//           ) : (
//             <p className="font-body-ar text-body-small text-on-surface-variant">
//               إعجابك يشجّعنا على مواصلة خدمة زوار قم.
//             </p>
//           )}
//         </div>
//       </Reveal>
//     </section>
//   )
// }
