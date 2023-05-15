import * as React from "react";
import ButtonToggle from "../../components/common/ButtonToggle";
import { useEventsContext } from "../../utils/events";
import {
  ToggleGrouping,
  ToggleUnmounted,
  ClearEventLog,
  ToggleTimings,
  Pause,
  Play,
  BreakRefs,
  ExposeToGlobal,
} from "../../components/common/icons";
import { FeatureMemLeaks } from "../../../common/constants";
import { useMemoryLeaks } from "../../utils/memory-leaks";

type BooleanToggle = (fn: (state: boolean) => boolean) => void;
interface ToolbarProps {
  onGroupingChange: BooleanToggle;
  groupByParent: boolean;
  onShowUnmounted: BooleanToggle;
  showUnmounted: boolean;
  onShowTimings: BooleanToggle;
  showTimings: boolean;
}

const Toolbar = ({
  onGroupingChange,
  groupByParent,
  onShowUnmounted,
  showUnmounted,
  onShowTimings,
  showTimings,
}: ToolbarProps) => {
  const { clearAllEvents, paused, setPaused } = useEventsContext();
  const { breakLeakedObjectRefs, exposeLeakedObjectsToGlobal } =
    useMemoryLeaks();

  return (
    <div className="toolbar">
      <div style={{ flex: 1 }} />
      <div className="toolbar__buttons">
        <span className="toolbar__buttons-splitter" />
        <ButtonToggle
          icon={ToggleGrouping}
          isActive={groupByParent}
          onChange={onGroupingChange}
          tooltip={
            groupByParent
              ? "Switch to owner-ownee relationship view in component's tree"
              : "Switch to parent-child relationship view in component's tree"
          }
        />
        <ButtonToggle
          icon={ToggleUnmounted}
          isActive={showUnmounted}
          onChange={onShowUnmounted}
          tooltip={
            showUnmounted
              ? "Hide unmounted components"
              : "Show unmounted components"
          }
        />
        <ButtonToggle
          icon={ToggleTimings}
          isActive={showTimings}
          onChange={onShowTimings}
          tooltip={showTimings ? "Hide timings" : "Show timings"}
        />

        {FeatureMemLeaks && (
          <>
            <span className="toolbar__buttons-splitter" />

            <ButtonToggle
              icon={BreakRefs}
              onChange={breakLeakedObjectRefs}
              tooltip={
                "Break leaked React objects references\n\nWARNING: This action interferes with how React works, which can lead to behavior that is not possible naturally. Such interference can break the functionality of React. However, this technique allows you to localize the source of the memory leak and greatly simplify the investigation of root causes. Use with caution and for debugging purposes only."
              }
            />
            <ButtonToggle
              icon={ExposeToGlobal}
              onChange={exposeLeakedObjectsToGlobal}
              tooltip={
                "Store potential leaked objects as global variable.\n\nThis allows investigate retainers in heap snapshot."
              }
            />
          </>
        )}

        <span className="toolbar__buttons-splitter" />

        <ButtonToggle
          icon={ClearEventLog}
          onChange={clearAllEvents}
          tooltip={"Clear event log"}
        />
        <ButtonToggle
          icon={!paused ? Play : Pause}
          isActive={!paused}
          onChange={() => setPaused(!paused)}
          tooltip={paused ? "Resume event loading" : "Pause event loading"}
        />
      </div>
    </div>
  );
};

const ToolbarMemo = React.memo(Toolbar);
ToolbarMemo.displayName = "Toolbar";

export default ToolbarMemo;
