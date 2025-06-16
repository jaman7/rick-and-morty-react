import { useCallback, useState } from 'react';

export const useFiltersPanelState = (initialPinned: boolean = false) => {
  const [collapsed, setCollapsed] = useState(false);
  const [tabVisible, setTabVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const [isPinned, setIsPinned] = useState(initialPinned);

  const togglePin = useCallback(() => {
    setIsPinned((prev) => !prev);
  }, []);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      if (!next) {
        setTabVisible(false);
        setTimeout(() => setContentVisible(true), 1500);
      } else {
        setContentVisible(false);
      }
      return next;
    });
  }, []);

  const handleTabVisible = useCallback(() => {
    if (collapsed) {
      setTabVisible(false);
      setContentVisible(true);
    } else {
      setTabVisible(true);
      setTimeout(() => setContentVisible(true), 1500);
    }
  }, []);

  return {
    collapsed,
    contentVisible,
    tabVisible,
    isPinned,
    togglePin,
    toggleCollapse,
    setTabVisible,
    setCollapsed,
    setContentVisible,
    handleTabVisible,
  };
};
