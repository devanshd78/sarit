"use client";

import React, { FC, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { post } from "@/lib/api";
import { format, addDays } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  CreditCard,
  Gift,
  AlertCircle,
  RefreshCw,
  Star,
  Heart,
} from "lucide-react";

// Enhanced interfaces with better typing
interface OrderItem {
  _id: string;
  bagName: string;
  price: number;
  quantity: number;
  images?: string[];
}

interface AddressPart {
  id: string;
  name: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: AddressPart;
  state: AddressPart;
  pin: string;
  phone: string;
}

interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
}

interface ShippingMethod {
  id: string;
  label: string;
  cost: number;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  contact: { email: string; subscribe: boolean };
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: string;
  shippingMethod?: ShippingMethod;
  subtotal: number;
  taxes: number;
  shippingCost: number;
  grossTotal: number;
  coupon?: Coupon;
  discount: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Enhanced loading skeleton component
const OrderSkeleton: FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-6 space-y-6">
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="h-20 bg-gray-200 rounded-2xl animate-pulse"></div>
      
      {/* Status skeleton */}
      <div className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
      
      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
        <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Order status timeline component
const OrderTimeline: FC<{ status: string; createdAt: string }> = ({ status, createdAt }) => {
  const steps = [
    { key: 'pending', label: 'Order Placed', icon: CheckCircle2, color: 'text-green-500' },
    { key: 'processing', label: 'Processing', icon: Package, color: 'text-blue-500' },
    { key: 'shipped', label: 'Shipped', icon: Truck, color: 'text-indigo-500' },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'text-green-600' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === status);
  const estimatedDelivery = addDays(new Date(createdAt), 5);

  return (
    <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <CardTitle className="flex items-center space-x-2">
          <Truck className="w-5 h-5 text-blue-600" />
          <span>Order Progress</span>
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Estimated delivery: {format(estimatedDelivery, 'PPP')}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200"></div>
          <div 
            className="absolute left-6 top-8 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-500 transition-all duration-1000"
            style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          ></div>
          
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-center space-x-4"
                >
                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500 text-white shadow-lg' 
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-blue-600 font-medium">In Progress</p>
                    )}
                  </div>
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced error component with retry
const ErrorDisplay: FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4"
  >
    <Card className="max-w-md w-full border-0 shadow-xl rounded-2xl overflow-hidden">
      <CardContent className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <AlertCircle className="w-8 h-8 text-red-500" />
        </motion.div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="space-y-3">
          <Button onClick={onRetry} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" asChild className="w-full">
            <a href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const OrderConfirmationPage: FC = () => {
  const params = useSearchParams();
  const orderId = params.get("orderId") ?? "";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!orderId) {
      setError("No order ID provided.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const res = await post<{ success: boolean; data: Order; message?: string }>(
        "/checkout/getbyId",
        { orderId }
      );
      
      if (res.success) {
        setOrder(res.data);
      } else {
        setError(res.message || "Failed to load order.");
      }
    } catch (err) {
      setError("Server error loading order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) return <OrderSkeleton />;
  if (error) return <ErrorDisplay error={error} onRetry={fetchOrder} />;
  if (!order) return null;

  const statusMap = {
    pending: { icon: Clock, color: "bg-orange-100 text-orange-800 border-orange-200" },
    processing: { icon: Package, color: "bg-blue-100 text-blue-800 border-blue-200" },
    shipped: { icon: Truck, color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
    delivered: { icon: CheckCircle2, color: "bg-green-100 text-green-800 border-green-200" },
    cancelled: { icon: AlertCircle, color: "bg-red-100 text-red-800 border-red-200" },
  } as const;

  const currentStatus = statusMap[order.status as keyof typeof statusMap] || statusMap.pending;
  const StatusIcon = currentStatus.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 rounded-2xl shadow-lg">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </motion.div>
            <AlertTitle className="text-green-800 font-bold">
              🎉 Order Confirmed Successfully!
            </AlertTitle>
            <AlertDescription className="text-green-700">
              Thank you for your purchase! Your order has been received and is being processed.
              You'll receive email updates about your order status.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Order Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Order #{order.orderId}
                  </CardTitle>
                  <p className="text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Placed on {format(new Date(order.createdAt), "PPP 'at' p")}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge className={`${currentStatus.color} border px-3 py-1 font-semibold`}>
                    <StatusIcon className="w-4 h-4 mr-2" />
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Order Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <OrderTimeline status={order.status} createdAt={order.createdAt} />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Items & Addresses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span>Order Items ({order.items.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold text-gray-700">Item</TableHead>
                          <TableHead className="text-center font-semibold text-gray-700">Qty</TableHead>
                          <TableHead className="text-right font-semibold text-gray-700">Price</TableHead>
                          <TableHead className="text-right font-semibold text-gray-700">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {order.items.map((item, index) => (
                            <motion.tr
                              key={item._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="hover:bg-gray-50 transition-colors duration-200"
                            >
                              <TableCell className="py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-gray-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 line-clamp-2">
                                      {item.bagName}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="secondary" className="bg-gray-100">
                                  {item.quantity}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ₹{item.price.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right font-bold text-gray-900">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Addresses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Shipping Address */}
              <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                  <CardTitle className="flex items-center space-x-2 text-green-800">
                    <MapPin className="w-5 h-5" />
                    <span>Shipping Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p className="text-gray-700">{order.shippingAddress.address}</p>
                    {order.shippingAddress.apartment && (
                      <p className="text-gray-700">{order.shippingAddress.apartment}</p>
                    )}
                    <p className="text-gray-700">
                      {order.shippingAddress.city.name}, {order.shippingAddress.state.name} - {order.shippingAddress.pin}
                    </p>
                    <div className="flex items-center space-x-2 text-gray-600 pt-2">
                      <Phone className="w-4 h-4" />
                      <span>{order.shippingAddress.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                  <CardTitle className="flex items-center space-x-2 text-purple-800">
                    <Mail className="w-5 h-5" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{order.contact.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {order.paymentMethod === 'gateway' ? 'Online Payment' : order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  {order.shippingMethod && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Truck className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Shipping Method</p>
                        <p className="font-medium text-gray-900">{order.shippingMethod.label}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Order Summary */}
            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden sticky top-6">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{order.subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Taxes (9%)</span>
                    <span className="font-medium">₹{order.taxes.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {order.shippingCost === 0 ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">FREE</Badge>
                      ) : (
                        `₹${order.shippingCost.toLocaleString()}`
                      )}
                    </span>
                  </div>

                  {order.coupon && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="flex items-center space-x-2">
                        <Gift className="w-4 h-4 text-green-600" />
                        <span className="text-green-800 font-medium">
                          Coupon ({order.coupon.code})
                        </span>
                      </div>
                      <span className="font-bold text-green-600">
                        -₹{order.coupon.discountAmount.toLocaleString()}
                      </span>
                    </motion.div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <span className="text-xl font-bold text-gray-900">Total Paid</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{order.total.toLocaleString()}
                  </span>
                </div>

                <div className="pt-4 space-y-3">
                  <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <a href="/collections">
                      Continue Shopping
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center py-8"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Thank you for choosing Zexa! We hope you love your new bags.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm">
                <Star className="w-4 h-4 mr-2" />
                Rate Your Experience
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderConfirmationPage;