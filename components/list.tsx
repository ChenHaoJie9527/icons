"use client";

import Fuse from "fuse.js";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import type { Icon } from "@/actions/get-icons";

import { Card, CardActions, CardTitle } from "@/components/card";
import { ICON_LIST } from "@/icons";
import { SearchInput } from "./search-input";

type Props = {
  icons: Icon[];
};

const ICON_MAP = new Map(ICON_LIST.map((item) => [item.name, item.icon]));

const IconItem = ({
  icon,
  Icon,
}: {
  icon: Icon;
  Icon: React.ElementType | undefined;
}) => {
  const animationRef = useRef<{
    startAnimation: () => void;
    stopAnimation: () => void;
  }>(null);

  if (!Icon) {
    return null;
  }

  return (
    <Card
      animationRef={animationRef}
      className="[contain-intrinsic-size:auto_180px] [content-visibility:auto]"
      key={icon.name}
      onMouseEnter={() => animationRef.current?.startAnimation()}
      onMouseLeave={() => animationRef.current?.stopAnimation()}
    >
      <Icon
        className="flex items-center justify-center [&>svg]:size-10 [&>svg]:text-neutral-800 dark:[&>svg]:text-neutral-100"
        ref={animationRef}
      />
      <CardTitle>{icon.name}</CardTitle>
      <CardActions {...icon} />
    </Card>
  );
};

const IconsList = ({ icons }: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const deferredSearchValue = useDeferredValue(searchValue); // 使用 useDeferredValue 来延迟搜索值的更新

  const fuse = useMemo(
    () =>
      new Fuse(icons, {
        keys: [
          { name: "name", weight: 3 }, // 名称权重更高
          { name: "keywords", weight: 2 }, // 关键词权重较低
        ],
        threshold: 0.3, // 匹配度阈值（0完全匹配，1匹配所有）
        ignoreLocation: true, // 不考虑匹配位置
        findAllMatches: true, // 找出所有匹配
        isCaseSensitive: false, // 不区分大小写
        minMatchCharLength: 2, // 至少匹配2个字符
      }),
    [icons]
  );

  // 延迟搜索
  const filteredIcons = useMemo(() => {
    if (!deferredSearchValue.trim()) return icons;
    return fuse.search(deferredSearchValue).map((result) => result.item); // 使用 fuse.search 进行搜索
  }, [fuse, icons, deferredSearchValue]); // 依赖项

  return (
    <div className="mb-20 w-full">
      <SearchInput
        searchOpen={searchOpen}
        searchValue={searchValue}
        setSearchOpen={setSearchOpen}
        setSearchValue={setSearchValue}
      />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[3px]">
        {filteredIcons.length === 0 && (
          <div className="col-span-full pt-10 text-center text-neutral-500 text-sm">
            No icons found
          </div>
        )}
        {filteredIcons.map((icon) => (
          <IconItem
            Icon={ICON_MAP.get(icon.name) ?? undefined}
            icon={icon}
            key={icon.name}
          />
        ))}
      </div>
    </div>
  );
};

export { IconsList };
