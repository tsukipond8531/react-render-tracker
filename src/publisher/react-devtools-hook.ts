import { RendererInterface, ReactInternals, Fiber, FiberRoot } from "./types";

type ReactDevtoolsHook = {
  supportsFiber: boolean;
  inject: (renderer: ReactInternals) => number;
  // onScheduleRoot(rendererId: number, root: FiberRoot, children: any[]) {},
  onCommitFiberUnmount: (rendererId: number, fiber: Fiber) => void;
  onCommitFiberRoot: (
    rendererId: number,
    root: FiberRoot,
    priorityLevel: any
  ) => void;
  onPostCommitFiberRoot: (rendererId: number, root: FiberRoot) => void;
};

/**
 * {@link packages/react-devtools-shared/src/hook.js}
 */

export function createReactDevtoolsHook(
  attachRenderer: (renderer: ReactInternals) => RendererInterface,
  existing: ReactDevtoolsHook
) {
  const rendererInterfaces = new Map<number, RendererInterface>();
  const fiberRoots = new Map<number, Set<FiberRoot>>();
  let rendererSeedId = 0;

  const reactDevtoolsHook: ReactDevtoolsHook = {
    // This is a legacy flag.
    // React v16 checks the hook for this to ensure DevTools is new enough.
    supportsFiber: true,

    inject(renderer) {
      const id =
        typeof existing.inject === "function"
          ? existing.inject(renderer)
          : ++rendererSeedId;

      if (typeof renderer.findFiberByHostInstance === "function") {
        rendererInterfaces.set(id, attachRenderer(renderer));
        fiberRoots.set(id, new Set());
      } else {
        console.warn(
          "[react-render-tracker] Unsupported React version",
          renderer.version
        );
      }

      return id;
    },

    // onScheduleRoot(rendererId, root, children) {},

    onCommitFiberUnmount(rendererId, fiber) {
      if (typeof existing.onCommitFiberUnmount === "function") {
        existing.onCommitFiberUnmount(rendererId, fiber);
      }

      if (!rendererInterfaces.has(rendererId)) {
        return;
      }

      try {
        console.log("handleCommitFiberUnmount");
        rendererInterfaces.get(rendererId).handleCommitFiberUnmount(fiber);
      } catch (e) {
        console.error(e);
        // debugger;
      }
    },

    onCommitFiberRoot(rendererId, root, priorityLevel) {
      if (typeof existing.onCommitFiberRoot === "function") {
        existing.onCommitFiberRoot(rendererId, root, priorityLevel);
      }

      if (!rendererInterfaces.has(rendererId)) {
        return;
      }

      const mountedRoots = fiberRoots.get(rendererId);
      const isKnownRoot = mountedRoots.has(root);
      const current = root.current;
      const isUnmounting =
        current.memoizedState == null || current.memoizedState.element == null;

      // Keep track of mounted roots so we can hydrate when DevTools connect.
      if (!isKnownRoot && !isUnmounting) {
        mountedRoots.add(root);
      } else if (isKnownRoot && isUnmounting) {
        mountedRoots.delete(root);
      }

      try {
        console.log("handleCommitFiberRoot");
        rendererInterfaces
          .get(rendererId)
          .handleCommitFiberRoot(root, priorityLevel);
      } catch (e) {
        console.error(e);
        // debugger;
      }
    },

    /**
     * React calls this method
     */
    onPostCommitFiberRoot(rendererId, root) {
      if (typeof existing.onPostCommitFiberRoot === "function") {
        existing.onPostCommitFiberRoot(rendererId, root);
      }

      if (!rendererInterfaces.has(rendererId)) {
        return;
      }

      try {
        console.log("handlePostCommitFiberRoot");
        rendererInterfaces.get(rendererId).handlePostCommitFiberRoot(root);
      } catch (e) {
        console.error(e);
        // debugger;
      }
    },
  };

  return reactDevtoolsHook;
}

/**
 * React uses hardcoded hook name.
 * {@link packages/react-reconciler/src/ReactFiberDevToolsHook.new.js L:44}
 */
const hookName = "__REACT_DEVTOOLS_GLOBAL_HOOK__";
const MARKER = Symbol();

export function installReactDevtoolsHook(
  target: any,
  attachRenderer: (renderer: ReactInternals) => RendererInterface
) {
  const existingHook = target[hookName];

  if (target.hasOwnProperty(hookName)) {
    if (existingHook[MARKER] === MARKER) {
      return existingHook;
    }
  }

  const hook = createReactDevtoolsHook(attachRenderer, { ...existingHook });

  if (existingHook) {
    existingHook[MARKER] = MARKER;

    for (const [key, value] of Object.entries(hook)) {
      delete existingHook[key];
      existingHook[key] = value;
    }
  } else {
    Object.defineProperty(target, hookName, {
      // This property needs to be configurable for the test environment,
      // else we won't be able to delete and recreate it between tests.
      configurable: true,
      enumerable: false,
      get() {
        return hook;
      },
    });
  }

  return target[hookName];
}
