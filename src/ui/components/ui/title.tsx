
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { INote } from "@/interfaces/INote";
// import { Check, Copy } from "lucide-react";

// import { useState } from "react";

// interface TitleProps{
//     initialData: INote,
// }

// export default function Title({initialData}: TitleProps){

//     const [copied, setCopied] = useState(false);

//     function CopyTitle(){
//         navigator.clipboard.writeText(initialData.title);
//         setCopied(true);
//         setTimeout(() => {
//             setCopied(false);
//         }, 1000);
        
//     }

//     return(
//         <div className="flex items-center gap-x-1">
//             <Button onClick={ CopyTitle } disabled={ copied } variant="ghost" className="font-normal h-auto p-1">
//                 <span className="truncate">
//                     {initialData?.title}
//                 </span>
//                 {
//                     copied ? (
//                         <Check className="h-4 w-4"/>
//                     ) :
//                     (
//                         <Copy className="h-4 w-4"/>
//                     )
//                 }
//             </Button>
//         </div>
//     );
// }

// Title.Skeleton = function TitleSkeleton(){
//     return (
//         <Skeleton className="h-9 w-20 rounded-md" />
//     );
// }