"use client";

import { MY_ORDERS_QUERY_RESULT } from "@/sanity.types"; // FIXED: Corrected casing convention
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";

interface OrderDetailsDialogProps {
  order: MY_ORDERS_QUERY_RESULT[number] | null; // FIXED: Linked to updated snake-case schema array entry
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Order Details - {order?.orderNumber}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 text-sm text-slate-600 space-y-1.5">
          <p>
            <strong className="text-slate-900">Customer:</strong> {order.customerName}
          </p>
          <p>
            <strong className="text-slate-900">Email:</strong> {order.email}
          </p>
          <p>
            <strong className="text-slate-900">Date:</strong>{" "}
            {order.orderDate && new Date(order.orderDate).toLocaleDateString()}
          </p>
          <p>
            <strong className="text-slate-900">Status:</strong>{" "}
            <span className="capitalize text-green-600 font-bold">
              {order.status}
            </span>
          </p>
          <p>
            <strong className="text-slate-900">Invoice Number:</strong> {order?.invoice?.number || "N/A"}
          </p>
          {order?.invoice && order?.invoice?.hosted_invoice_url && (
            <Button asChild className="bg-transparent border text-darkColor/80 mt-2 hover:text-darkColor hover:border-darkColor hover:bg-darkColor/10 hoverEffect shadow-none">
              <Link href={order.invoice.hosted_invoice_url} target="_blank">
                Download Invoice
              </Link>
            </Button>
          )}
        </div>
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* FIXED: Provided parameter type definitions to clean out implicit any rules */}
            {order.products?.map((product: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-3 font-semibold text-slate-800">
                  {product?.product?.images && (
                    <Image
                      src={urlFor(product?.product?.images[0]).url()}
                      alt="productImage"
                      width={50}
                      height={50}
                      className="border rounded-md object-cover h-12 w-12"
                    />
                  )}
                  {product?.product?.name}
                </TableCell>
                <TableCell className="font-semibold text-slate-600">{product?.quantity}</TableCell>
                <TableCell>
                  <PriceFormatter
                    amount={product?.product?.price ?? undefined}
                    className="text-black font-medium"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 text-right flex items-center justify-end">
          <div className="w-44 flex flex-col gap-1 text-sm text-slate-600">
            {order?.amountDiscount !== 0 && order?.amountDiscount !== null && (
              <div className="w-full flex items-center justify-between">
                <strong>Discount: </strong>
                <PriceFormatter
                  amount={order?.amountDiscount}
                  className="text-black font-bold"
                />
              </div>
            )}
            {order?.amountDiscount !== 0 && order?.amountDiscount !== null && (
              <div className="w-full flex items-center justify-between">
                <strong>Subtotal: </strong>
                <PriceFormatter
                  amount={
                    (order?.totalPrice as number) +
                    (order?.amountDiscount as number)
                  }
                  className="text-black font-bold"
                />
              </div>
            )}
            <div className="w-full flex items-center justify-between border-t pt-1 mt-1 text-base text-slate-900">
              <strong>Total: </strong>
              <PriceFormatter
                amount={order?.totalPrice ?? undefined}
                className="text-black font-black"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;