import { toWords } from "number-to-words"

export default function ({ amount }: { amount: number }) {
    if (!amount) return null

    return (
        <p className="text-green-600 font-semibold text-xs italic ">
            {toWords(amount)} rupees
        </p>
    )
}