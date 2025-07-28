"use client";
import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, IndianRupeeIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import QuantityStepper from "./QuantityStepper";
import type { CartItem } from "./context/CartContext";
import { toMoney } from "@/utils/money";

interface Props {
  item: CartItem;
  onInc: () => void;
  onDec: () => void;
  onRemove: () => void;
}

const CartItemRow: FC<Props> = ({ item, onInc, onDec, onRemove }) => {
  const imgSrc = item.images?.[0] ?? "/placeholder.png";
  const price = Number(item.price ?? 0);
  const qty = Number(item.quantity ?? 0);

  return (
    <Card className="flex flex-col md:flex-row">
      <div className="relative w-full md:w-40 h-40 flex-shrink-0">
        <Image src={imgSrc} alt={item.bagName} fill className="object-cover rounded-l-md" />
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <Link href={`/collection/view?id=${item._id}`}>
            <h2 className="text-xl font-semibold hover:text-sareet-primary transition">{item.bagName}</h2>
          </Link>
          <p className="mt-1 text-gray-600">Color: {item.colors?.[0] ?? "—"}</p>
          <p className="mt-2 text-lg font-medium flex items-center">
            <IndianRupeeIcon className="inline-block mr-1" size={18} />
            {toMoney(price)}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <QuantityStepper value={qty} onInc={onInc} onDec={onDec} />
          <button onClick={onRemove} className="text-gray-400 hover:text-red-600" aria-label="Remove item">
            <Trash2 size={20} />
          </button>
          <p className="text-lg font-semibold flex items-center">
            <IndianRupeeIcon className="inline-block mr-1" size={16} />
            {toMoney(price * qty)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CartItemRow;