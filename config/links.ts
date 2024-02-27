import {
  Github,
  Props,
  Leetcode,
  Wechat,
} from "@icons-pack/react-simple-icons";
import { FC } from "react";

export type LinkType = {
  url: string;
  icon: FC<Props> | string;
  color: string;
  fill: string;
  border: string;
  text: string;
  shadow: string;
  id?: string;
  name?: string;
};

export const links: readonly LinkType[] = [
  {
    url: "https://github.com/MilesPan",
    icon: Github,
    color: "from-bg-[#24292f] to-bg-[#040d21]",
    fill: "fill-[#181717]",
    border: "border-[#181717]",
    text: "text-[#181717]",
    shadow: "shadow-true-gray-400",
    id: "MilesPan",
    name: "GitHub",
  },
  {
    url: "",
    icon: Wechat,
    color: "from-bg-[#0ba360] to-bg-[#3cba92]",
    fill: "fill-[#3cba92]",
    border: "border-[#3cba92]",
    text: "text-[#3cba92]",
    shadow: "shadow-true-green-400",
  },

  {
    url: "https://leetcode.cn/u/trusting-hellmannb0/",
    icon: Leetcode,
    fill: "fill-[#0A66C2]",
    border: "border-[#0A66C2]",
    shadow: "shadow-blue-300",
    text: "text-[#0A66C2]",
    color: "from-bg-[#B3B1B0] to-bg-[#C98F1B]",
    name: "Leetcode",
  },
];
