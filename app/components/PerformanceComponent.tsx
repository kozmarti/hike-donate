import React from "react";
import {
  PerformanceItemComponent,
  PerformanceItemProps,
} from "./PerformanceItemComponent";

interface PerformanceData {
  items: PerformanceItemProps[];
}

const PerformanceComponent = ({ items }: PerformanceData) => {
  return items.map((item) => (
    <PerformanceItemComponent loading={item.loading} title={item.title} quantity={item.quantity} />
  ));
};

export default PerformanceComponent;
