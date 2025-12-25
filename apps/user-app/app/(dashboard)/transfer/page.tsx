
// import { AddMoney } from "../../../components/AddMoneyTab";
// import { BalanceCard } from "../../../components/BalanceCard";
// import { OnRampTransactions } from "../../../components/OnRampTransactions";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../lib/auth";



// export default async function () {


//     return <div className="w-screen">
//         <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
//             Transfer
//         </div>
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
//             <div>
//                 <AddMoney user={session.user} />
//             </div>
//             <div>
//                 <BalanceCard amount={balance.amount} locked={balance.locked} />
//                 <div className="pt-4">
//                     <OnRampTransactions transactions={transactions} />
//                 </div>
//             </div>
//         </div>
//     </div>
// }