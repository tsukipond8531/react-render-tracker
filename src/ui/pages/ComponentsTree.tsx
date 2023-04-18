import * as React from "react";
import { FindMatchContextProvider } from "../utils/find-match";
import Toolbar from "../components/toolbar/Toolbar";
import FiberTree from "../components/fiber-tree/Tree";
import FiberTreeHeader from "../components/fiber-tree/TreeHeader";
import Details from "../components/details/Details";
import FiberTreeKeyboardNav from "../components/misc/FiberTreeKeyboardNav";
import { useSelectedId } from "../utils/selection";
import { usePinnedId } from "../utils/pinned";

export function ComponentsTreePage() {
  const [groupByParent, setGroupByParent] = React.useState(false);
  const [showUnmounted, setShowUnmounted] = React.useState(true);
  const [showTimings, setShowTimings] = React.useState(false);
  const { selectedId } = useSelectedId();
  const { pinnedId } = usePinnedId();

  return (
    <div
      className="app-page app-page-components-tree"
      data-has-selected={selectedId !== null || undefined}
    >
      <FindMatchContextProvider>
        <Toolbar
          onGroupingChange={setGroupByParent}
          groupByParent={groupByParent}
          onShowUnmounted={setShowUnmounted}
          showUnmounted={showUnmounted}
          onShowTimings={setShowTimings}
          showTimings={showTimings}
        />

        <FiberTreeHeader
          rootId={pinnedId}
          groupByParent={groupByParent}
          showTimings={showTimings}
        />
        <FiberTreeKeyboardNav
          groupByParent={groupByParent}
          showUnmounted={showUnmounted}
        />
        <FiberTree
          rootId={pinnedId}
          groupByParent={groupByParent}
          showUnmounted={showUnmounted}
          showTimings={showTimings}
        />
      </FindMatchContextProvider>

      {selectedId !== null && (
        <Details
          rootId={selectedId}
          groupByParent={groupByParent}
          showUnmounted={showUnmounted}
          showTimings={showTimings}
        />
      )}
    </div>
  );
}
