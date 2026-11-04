export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  ASSIGNED: 'assigned',
  PICKED_UP: 'picked_up',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  READY_FOR_PICKUP: 'ready_for_pickup',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
};

export const DELIVERY_TRANSITIONS = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.REJECTED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PREPARING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PREPARING]: [ORDER_STATUS.READY, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.READY]: [ORDER_STATUS.ASSIGNED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.ASSIGNED]: [ORDER_STATUS.PICKED_UP, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PICKED_UP]: [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.OUT_FOR_DELIVERY]: [ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.REJECTED]: [],
  [ORDER_STATUS.CANCELLED]: []
};

export const PICKUP_TRANSITIONS = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.REJECTED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PREPARING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PREPARING]: [ORDER_STATUS.READY, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.READY]: [ORDER_STATUS.READY_FOR_PICKUP, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.READY_FOR_PICKUP]: [ORDER_STATUS.COMPLETED],
  [ORDER_STATUS.COMPLETED]: [],
  [ORDER_STATUS.REJECTED]: [],
  [ORDER_STATUS.CANCELLED]: []
};

export const STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: { label: 'Order Placed', color: 'amber', description: 'Waiting for restaurant confirmation' },
  [ORDER_STATUS.CONFIRMED]: { label: 'Confirmed', color: 'blue', description: 'Restaurant accepted your order' },
  [ORDER_STATUS.PREPARING]: { label: 'In the Kitchen', color: 'indigo', description: 'Chef is preparing your meal' },
  [ORDER_STATUS.READY]: { label: 'Food Ready', color: 'cyan', description: 'Packed & waiting for pickup/rider' },
  [ORDER_STATUS.ASSIGNED]: { label: 'Rider Assigned', color: 'purple', description: 'Delivery partner on the way to restaurant' },
  [ORDER_STATUS.PICKED_UP]: { label: 'Order Picked Up', color: 'orange', description: 'Rider collected package from kitchen' },
  [ORDER_STATUS.OUT_FOR_DELIVERY]: { label: 'Out for Delivery', color: 'primary', description: 'Rider is speeding towards your doorstep' },
  [ORDER_STATUS.DELIVERED]: { label: 'Delivered', color: 'emerald', description: 'Enjoy your hot meal!' },
  [ORDER_STATUS.READY_FOR_PICKUP]: { label: 'Ready for Takeaway', color: 'cyan', description: 'Please show order ID at counter' },
  [ORDER_STATUS.COMPLETED]: { label: 'Picked Up', color: 'emerald', description: 'Order completed successfully' },
  [ORDER_STATUS.REJECTED]: { label: 'Restaurant Rejected', color: 'rose', description: 'Restaurant could not fulfill order' },
  [ORDER_STATUS.CANCELLED]: { label: 'Cancelled', color: 'red', description: 'Order was cancelled' }
};

export function canTransition(currentStatus, nextStatus, orderType = 'delivery') {
  const table = orderType === 'pickup' ? PICKUP_TRANSITIONS : DELIVERY_TRANSITIONS;
  const allowed = table[currentStatus] || [];
  return allowed.includes(nextStatus);
}
