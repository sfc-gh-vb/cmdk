import React from "react";

function is(x: any, y: any) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
  );
}

function checkIfSnapshotChanged<T>(inst: {
  value: T;
  getSnapshot: () => T;
}): boolean {
  const latestGetSnapshot = inst.getSnapshot;
  const prevValue = inst.value;
  try {
    const nextValue = latestGetSnapshot();
    return !is(prevValue, nextValue);
  } catch (error) {
    return true;
  }
}

function useSyncExternalStore<T>(subscribe: any, getSnapshot: () => T): T {
  const value = getSnapshot();
  const [{ inst }, forceUpdate] = React.useState({
    inst: { value, getSnapshot },
  });

  React.useLayoutEffect(() => {
    inst.value = value;
    inst.getSnapshot = getSnapshot;

    if (checkIfSnapshotChanged(inst)) {
      forceUpdate({ inst });
    }
  }, [subscribe, value, getSnapshot]);

  React.useEffect(() => {
    if (checkIfSnapshotChanged(inst)) {
      forceUpdate({ inst });
    }
    const handleStoreChange = () => {
      if (checkIfSnapshotChanged(inst)) {
        forceUpdate({ inst });
      }
    };
    return subscribe(handleStoreChange);
  }, [subscribe]);

  return value;
}

export {useSyncExternalStore}