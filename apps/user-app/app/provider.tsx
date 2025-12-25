"use client"

import { Provider } from "jotai";
import { userAtom } from "@repo/store/userAtom";
import { balanceAtom } from "@repo/store/balanceAtom";

import { useHydrateAtoms } from "jotai/utils";

function Hydrate({ user, balance, children }: any) {
    useHydrateAtoms([
        [userAtom, user],
        [balanceAtom, balance],
    ]);
    return children
}

export function Providers(props: any) {
    return (
        <Provider>
            <Hydrate {...props} />
        </Provider>
    );
}
