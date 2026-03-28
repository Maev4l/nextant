import { useTheme } from '@react-navigation/core';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button.jsx';
import { cn } from '../utils/cn.js';

/**
 * Stack header component
 *
 * Supports react-navigation compatible options:
 * - headerLeft: function or element for left side
 * - headerRight: function or element for right side
 * - headerTitle: string or function for custom title rendering
 * - headerTitleAlign: 'left' | 'center' alignment
 * - headerBackIcon: custom icon component for back button
 * - headerBackTitle: label text next to back icon
 * - headerBackTitleStyle: styling for back title
 * - headerBackVisible: show back button alongside headerLeft
 * - headerTintColor: tint color for header elements
 * - headerShadowVisible: show/hide bottom border
 * - headerTransparent: make header transparent and absolute
 * - headerBackground: custom background element
 */
export const Header = ({
  title,
  canGoBack,
  onBackPress,
  headerLeft,
  headerRight,
  headerTitle,
  headerTitleAlign = 'center',
  headerBackIcon,
  headerBackTitle,
  headerBackTitleStyle,
  headerBackVisible,
  headerTintColor,
  headerStyle,
  headerTitleStyle,
  headerShadowVisible = true,
  headerTransparent = false,
  headerBackground,
  className,
}) => {
  const { colors } = useTheme();
  const tintColor = headerTintColor || colors.primary;

  // Render the back button with optional title
  const renderBackButton = () => {
    const BackIcon = headerBackIcon || ChevronLeft;
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={onBackPress}
        className={cn('text-primary', headerBackTitle && 'pr-1')}
        style={{ color: tintColor }}
        aria-label="Go back"
      >
        <BackIcon className="h-6 w-6" />
        {headerBackTitle && (
          <span
            className="text-sm ml-1"
            style={{
              color: tintColor,
              ...headerBackTitleStyle,
            }}
          >
            {headerBackTitle}
          </span>
        )}
      </Button>
    );
  };

  const renderLeft = () => {
    // Props passed to headerLeft function (react-navigation compatible)
    const headerLeftProps = {
      canGoBack,
      onPress: onBackPress,
      tintColor,
      label: headerBackTitle,
      href: undefined,
    };

    if (headerLeft) {
      const customLeft = typeof headerLeft === 'function'
        ? headerLeft(headerLeftProps)
        : headerLeft;

      // If headerBackVisible is true, show back button alongside custom headerLeft
      if (headerBackVisible && canGoBack) {
        return (
          <>
            {renderBackButton()}
            {customLeft}
          </>
        );
      }

      return customLeft;
    }

    if (canGoBack) {
      return renderBackButton();
    }

    return <div className="w-10" />;
  };

  const renderRight = () => {
    if (headerRight) {
      // Props passed to headerRight function (react-navigation compatible)
      const headerRightProps = {
        canGoBack,
        tintColor,
      };

      return typeof headerRight === 'function'
        ? headerRight(headerRightProps)
        : headerRight;
    }

    return <div className="w-10" />;
  };

  const renderTitle = () => {
    // Support headerTitle as function (react-navigation compatible)
    if (typeof headerTitle === 'function') {
      return headerTitle({
        children: title,
        tintColor,
      });
    }

    // Use headerTitle string if provided, otherwise fall back to title
    const titleText = typeof headerTitle === 'string' ? headerTitle : title;

    return (
      <h1
        className={cn(
          'font-semibold text-base truncate px-2',
          headerTitleAlign === 'center' ? 'flex-1 text-center' : 'text-left'
        )}
        style={{
          color: colors.text,
          ...headerTitleStyle,
        }}
      >
        {titleText}
      </h1>
    );
  };

  return (
    <header
      className={cn(
        'nextant-header flex items-center h-14 px-2 shrink-0',
        'pt-[max(0.5rem,env(safe-area-inset-top))]',
        headerShadowVisible && 'border-b',
        headerTransparent && 'absolute inset-x-0 top-0 z-10',
        className
      )}
      style={{
        backgroundColor: headerTransparent ? 'transparent' : colors.card,
        borderColor: headerShadowVisible ? colors.border : 'transparent',
        ...headerStyle,
      }}
    >
      {/* Custom background layer */}
      {headerBackground && (
        <div className="absolute inset-0 -z-10">
          {typeof headerBackground === 'function' ? headerBackground() : headerBackground}
        </div>
      )}

      {/* Left */}
      <div className="flex items-center shrink-0">
        {renderLeft()}
      </div>

      {/* Title - flex-1 only when centered */}
      {headerTitleAlign === 'center' ? (
        renderTitle()
      ) : (
        <div className="flex-1 flex items-center">
          {renderTitle()}
        </div>
      )}

      {/* Right */}
      <div className="flex items-center shrink-0">
        {renderRight()}
      </div>
    </header>
  );
};
