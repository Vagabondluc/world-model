# 🗺️ Map Visualization & Interaction Design Document

## Overview

This document defines the visual design system for displaying dynamic content on the Mappa Imperium grid map. The system handles pins, connections, visual states, and interactive tooltips that evolve throughout the game's six eras.

---

## 🎯 Core Design Principles

### **1. Visual Hierarchy**
- **Base Layer**: Terrain (water/land) with territory boundaries
- **Feature Layer**: Cities, monuments, resources with pins
- **Connection Layer**: Trade routes, relationships with lines
- **Interaction Layer**: Hover states, selection indicators
- **Information Layer**: Tooltips, detail panels

### **2. Information Density Management**
- **Era I-II**: Sparse content (geography, deities)
- **Era III**: Moderate density (settlements, early factions)
- **Era IV-VI**: High density (trade, wars, complex relationships)
- **Progressive Disclosure**: Show more detail on zoom/hover

### **3. Player Ownership Clarity**
- **Color Coding**: Consistent player colors across all elements
- **Visual Inheritance**: Elements inherit owner's visual theme
- **Neutral Elements**: Distinct styling for shared/world elements

---

## 📍 Pin System Design

### **Pin Categories & Visual Identity**

#### **Settlement Pins**
- **Villages**: Small circular pin with house emoji 🏘️
- **Towns**: Medium circular pin with buildings emoji 🏘️
- **Cities**: Large circular pin with city emoji 🏙️
- **Capitals**: Extra-large pin with crown emoji 👑
- **Ruins**: Faded pin with broken column emoji 🏛️

#### **Resource Pins** 
- **Natural Resources**: Diamond-shaped pins with resource emoji
  - Iron Ore: ⛏️, Gold: 🟨, Timber: 🌲, Stone: 🪨
- **Magical Resources**: Hexagonal pins with mystical emoji
  - Mana Crystals: 💎, Dragon Scales: 🐉, Phoenix Feathers: 🔥
- **Luxury Goods**: Circular pins with luxury emoji
  - Spices: 🌶️, Silk: 🧵, Pearls: 🦪

#### **Event Pins**
- **Battles**: Shield-shaped pins with crossed swords ⚔️
- **Discoveries**: Star-shaped pins with telescope emoji 🔭
- **Disasters**: Triangle pins with appropriate emoji (🌋🌊⚡)
- **Diplomatic Events**: Pentagon pins with handshake emoji 🤝

#### **Religious/Cultural Pins**
- **Temples**: Temple emoji 🛕 with denomination color
- **Sacred Sites**: Mountain emoji ⛰️ with divine aura effect
- **Monuments**: Classical building emoji 🏛️
- **Cultural Centers**: Masks emoji 🎭

### **Pin Visual States**

#### **Default State**
- **Background**: Solid circle with player color
- **Border**: 2px white outline for contrast
- **Icon**: Emoji centered in pin
- **Shadow**: Subtle drop shadow for depth

#### **Hover State**
- **Scale**: 110% size increase
- **Glow**: Soft outer glow in player color
- **Elevation**: Increased shadow for floating effect
- **Cursor**: Pointer cursor

#### **Active/Selected State**
- **Border**: Thick border in accent color
- **Pulse**: Subtle pulsing animation
- **Z-Index**: Elevated above other elements

#### **Historical/Destroyed State**
- **Opacity**: 50% transparency
- **Desaturation**: Grayscale filter
- **Icon Change**: Ruins emoji 🏛️ or broken symbol 💔
- **Animation**: Fade-out transition when destroyed

#### **Under Construction State**
- **Border**: Dashed outline
- **Icon Overlay**: Construction emoji 🚧
- **Animation**: Rotating construction indicator

---

## 🔗 Connection System Design

### **Trade Route Lines**

#### **Visual Style**
- **Line Type**: Dotted/dashed line
- **Thickness**: 3px for major routes, 2px for minor
- **Color**: Gradient between connected players' colors
- **Animation**: Moving dots along the line (🚛💰⚡)

#### **Route Types**
- **Land Routes**: Brown dotted lines 🟤
- **Sea Routes**: Blue dashed lines 🔵  
- **Magical Routes**: Purple glowing lines 🟣
- **Air Routes**: Light blue with cloud effects ☁️

#### **Interactive States**
- **Default**: Semi-transparent for clarity
- **Hover**: Full opacity with flowing animation
- **Selected**: Highlighted with route information
- **Inactive**: Faded when trade is disrupted

### **Relationship Lines**

#### **Alliance Lines**
- **Style**: Solid green line
- **Thickness**: 2px
- **Pattern**: None (solid connection)
- **Animation**: Subtle pulse for active alliances

#### **War Lines**
- **Style**: Jagged red line
- **Thickness**: 4px for major wars, 2px for skirmishes
- **Pattern**: Lightning bolt pattern ⚡
- **Animation**: Rapid flashing during active conflict

#### **Diplomatic Lines**
- **Style**: Curved blue line
- **Thickness**: 2px
- **Pattern**: Diplomatic symbols (🕊️) along the line
- **Animation**: Flowing dove icons

### **Line Interaction Behaviors**

#### **Collision Avoidance**
- **Smart Routing**: Lines curve around pins and other lines
- **Bundling**: Multiple connections between same points bundle together
- **Z-Order**: Active connections appear above inactive ones

#### **Information Display**
- **Hover Tooltip**: Shows connection type, volume, status
- **Click Action**: Opens detailed trade/relationship panel
- **Status Indicators**: Icons along line show current state

---

## 💬 Tooltip System Design

### **Hover Tooltip Structure**

#### **Header Section**
```
🏙️ [Player Color Dot] Ironhold
    Category: Capital City
```

#### **Key Information Section**
```
👥 Population: 45,000
💰 Wealth: Prosperous
🛡️ Defenses: Strong Walls
⚔️ Military: Royal Guard
```

#### **Current Status Section**
```
📊 Status: Thriving
🔄 Recent: Expanded markets (Year 142)
⚠️ Issues: Food shortage brewing
```

#### **Quick Actions Section**
```
[👁️ View Details] [✏️ Edit] [📜 History]
```

### **Tooltip Visual Design**

#### **Appearance**
- **Background**: Semi-transparent dark panel
- **Border**: Thin border in element's player color
- **Typography**: Clear hierarchy with emoji icons
- **Max Width**: 280px to prevent screen overflow
- **Animation**: Smooth fade-in/out (200ms)

#### **Positioning**
- **Smart Placement**: Appears above pin, adjusts if near screen edge
- **Pointer Arrow**: Small triangle pointing to source element
- **Offset**: 10px gap between pin and tooltip
- **Responsive**: Adjusts size for mobile devices

#### **Content Adaptation**
- **Element Type**: Different templates for cities, resources, events
- **Information Density**: More details for complex elements
- **Player Ownership**: Shows edit options only for owned elements
- **Era Context**: Information relevant to current era

---

## 🎨 Visual State Management

### **Element Card Integration**

#### **Status Synchronization**
- **Health**: City health reflects in pin brightness
- **Wealth**: Resource pins show abundance with glow intensity
- **Activity**: Trade routes pulse with transaction frequency
- **Age**: Older elements show weathering effects

#### **Visual Inheritance**
- **Player Colors**: All owned elements use consistent color scheme
- **Cultural Themes**: Faction-specific visual styling
- **Era Progression**: Visual evolution as eras advance
- **Relationship Reflection**: Allied elements show connection hints

### **Dynamic State Changes**

#### **Construction Events**
- **Before**: Placement preview with ghost effect
- **During**: Construction animation with progress indicator
- **Completion**: Celebration effect (sparkles ✨, fanfare)

#### **Destruction Events**
- **Warning**: Red glow for elements under threat
- **Destruction**: Dramatic collapse animation
- **Aftermath**: Ruins remain with historical tooltip
- **Reconstruction**: Phoenix rising effect if rebuilt

#### **Trade Fluctuations**
- **Boom**: Bright, active trade route animations
- **Bust**: Faded, slow trade route movement
- **Blockade**: Red X over trade routes
- **New Routes**: Sparkly appearance animation

---

## 📱 Responsive Design Considerations

### **Zoom Levels**

#### **Zoom Out (World View)**
- **Simplified Icons**: Basic shapes instead of detailed emoji
- **Reduced Clutter**: Only major elements visible
- **Aggregated Info**: Combined tooltips for clustered elements
- **Performance**: Simplified rendering for smooth interaction

#### **Zoom In (Detail View)**
- **Full Detail**: All emoji, effects, and information visible
- **Enhanced Tooltips**: Expanded information panels
- **Micro-Interactions**: Subtle hover effects on small elements
- **Accessibility**: Larger click targets

#### **Mobile Optimization**
- **Touch Targets**: Minimum 44px touch areas
- **Simplified Tooltips**: Essential information only
- **Gesture Support**: Pinch-to-zoom, tap-to-select
- **Performance**: Optimized rendering for mobile GPUs

---

## 🎭 Animation & Effects Library

### **Entrance Animations**
- **New Pins**: Scale up from 0% with bounce effect
- **Trade Routes**: Draw from source to destination
- **Connections**: Fade in with connecting pulse

### **State Change Animations**
- **Upgrade**: Glowing expansion effect
- **Damage**: Red flash with shake effect
- **Heal**: Green sparkle restoration
- **Status Change**: Smooth color transition

### **Ambient Effects**
- **Prosperity**: Gentle golden glow
- **Activity**: Subtle pulsing
- **Danger**: Red warning pulse
- **Mystery**: Shifting purple mist

### **Interaction Feedback**
- **Hover**: Smooth scale and glow
- **Click**: Brief highlight flash
- **Drag**: Follow cursor with preview
- **Drop**: Confirmation bounce

---

## 🎯 Accessibility Features

### **Screen Reader Support**
- **Alt Text**: Descriptive text for all visual elements
- **ARIA Labels**: Proper labeling for interactive elements
- **Focus Management**: Clear focus indicators
- **Keyboard Navigation**: Tab order through map elements

### **Visual Accessibility**
- **Color Blind Support**: Patterns and shapes supplement colors
- **High Contrast**: Optional high contrast mode
- **Text Scaling**: Tooltips scale with browser text size
- **Motion Reduction**: Respects prefers-reduced-motion

### **Interaction Accessibility**
- **Large Touch Targets**: Minimum 44px for mobile
- **Audio Feedback**: Subtle sound cues for interactions and state changes
- **Error Prevention**: Confirmation for destructive actions
- **Help Context**: Contextual help for complex interactions

---

## 🔧 Performance Optimization

### **Rendering Strategy**
- **Virtualization**: Only render visible map sections
- **Level of Detail**: Simplified rendering at distance
- **Batch Updates**: Group animation frames
- **Memory Management**: Clean up destroyed elements

### **Asset Optimization**
- **Emoji Fallbacks**: System emoji for maximum compatibility
- **Sprite Sheets**: Combine small icons for efficiency
- **Lazy Loading**: Load detailed graphics on demand
- **Caching**: Cache frequently accessed tooltip content

---

## 🎮 Player Experience Flow

### **Discovery Phase**
1. **Initial Exploration**: Hover over unknown areas
2. **Information Gathering**: Click for detailed tooltips
3. **Pattern Recognition**: Learn visual language
4. **Strategic Planning**: Use visual cues for decisions

### **Management Phase**
1. **Status Monitoring**: Quick visual health checks
2. **Relationship Tracking**: Follow connection lines
3. **Problem Identification**: Spot warning indicators
4. **Action Planning**: Use tooltips for decision making

### **Collaboration Phase**
1. **Information Sharing**: Point out elements to other players
2. **Negotiation Support**: Visual aids for discussions
3. **Progress Tracking**: Monitor collective achievements
4. **Conflict Resolution**: Clear ownership indicators

---

## 🎨 Technical Implementation Guidelines

### **Pin Rendering System**

#### **Pin Types & Shapes**
- **Circular**: Default settlements, resources
- **Diamond**: Special resources, magical items
- **Shield**: Military events, defensive structures
- **Star**: Discoveries, achievements
- **Triangle**: Warnings, disasters
- **Pentagon**: Diplomatic events
- **Hexagon**: Magical/mystical elements

#### **Size Classifications**
- **Micro (12px)**: Minor events, small resources
- **Small (16px)**: Villages, basic resources
- **Medium (24px)**: Towns, important events
- **Large (32px)**: Cities, major resources
- **Extra Large (48px)**: Capitals, world wonders

#### **Visual Effects System**
- **Glow Effects**: CSS box-shadow for ambient lighting
- **Pulse Animations**: CSS keyframes for attention
- **Particle Effects**: Canvas-based for dramatic events
- **Color Transitions**: CSS transitions for state changes

### **Line Drawing System**

#### **Line Rendering**
- **SVG Paths**: For precise curved lines
- **Canvas Drawing**: For animated particle effects
- **CSS Pseudo-elements**: For simple dotted lines
- **WebGL**: For complex multi-line scenes

#### **Path Calculation**
- **Bezier Curves**: For natural-looking trade routes
- **Collision Detection**: Avoid overlapping with pins
- **Dynamic Routing**: Recalculate when pins move
- **Performance**: Use quadtree for efficient collision detection

### **Tooltip Management**

#### **Positioning Logic**
- **Viewport Detection**: Keep tooltips on screen
- **Collision Avoidance**: Move away from other UI elements
- **Smart Anchoring**: Multiple anchor points per pin
- **Responsive Sizing**: Scale content for available space

#### **Content Loading**
- **Lazy Rendering**: Build tooltip content on demand
- **Template System**: Reusable tooltip templates
- **Data Binding**: Real-time updates from element cards
- **Performance**: Debounce hover events

---

## 🎨 Design System Components

### **Color Palette**

#### **Player Colors**
- **Player 1**: `#FF4444` (Red) - Fire, passion, aggression
- **Player 2**: `#4444FF` (Blue) - Water, wisdom, stability  
- **Player 3**: `#44FF44` (Green) - Nature, growth, prosperity
- **Player 4**: `#FFFF44` (Yellow) - Light, energy, knowledge
- **Player 5**: `#FF44FF` (Magenta) - Magic, mystery, nobility
- **Player 6**: `#44FFFF` (Cyan) - Air, freedom, innovation
- **Player 7**: `#FF8844` (Orange) - Earth, strength, endurance
- **Player 8**: `#8844FF` (Purple) - Spirit, divine, ancient

#### **System Colors**
- **Neutral**: `#666666` - Unowned elements
- **Success**: `#22C55E` - Positive states
- **Warning**: `#F59E0B` - Caution states
- **Danger**: `#EF4444` - Negative states
- **Info**: `#3B82F6` - Information states

### **Typography Scale**

#### **Tooltip Text Hierarchy**
- **Title**: 16px bold, player color
- **Subtitle**: 14px medium, neutral
- **Body**: 12px regular, neutral
- **Caption**: 10px regular, muted
- **Icon**: 14px emoji/symbol

### **Animation Timing**

#### **Standard Durations**
- **Micro**: 100ms - Button clicks, small state changes
- **Quick**: 200ms - Hover effects, tooltips
- **Standard**: 300ms - Modal transitions, pin animations
- **Slow**: 500ms - Page transitions, complex animations
- **Dramatic**: 1000ms - Major events, destruction

#### **Easing Functions**
- **ease-out**: Default for most interactions
- **ease-in-out**: For reversible animations
- **bounce**: For celebratory effects
- **ease-in**: For dramatic emphasis

---

## 🔄 State Management Integration

### **Element Card Synchronization**

#### **Real-time Updates**
- **Health Changes**: Immediate pin brightness updates
- **Status Changes**: Color and effect transitions
- **Relationship Changes**: Line appearance/disappearance
- **Property Updates**: Tooltip content refresh

#### **Historical Tracking**
- **State History**: Track all pin state changes
- **Undo/Redo**: Visual state rollback capability
- **Timeline Scrubbing**: Replay map evolution
- **Version Control**: Conflict resolution for collaborative edits

### **Performance Monitoring**

#### **Rendering Metrics**
- **Frame Rate**: Target 60fps for smooth interactions
- **Draw Calls**: Minimize for complex scenes
- **Memory Usage**: Track pin/line object lifecycle
- **Update Frequency**: Batch state changes

#### **User Experience Metrics**
- **Tooltip Response Time**: <100ms from hover
- **Pin Interaction Latency**: <50ms click response
- **Animation Smoothness**: No dropped frames
- **Load Time**: <2s for initial map render

---

## 🚀 Future Enhancements

### **Advanced Visualization Features**
- **Heat Maps**: Show activity density over time
- **3D Elevation**: Terrain height visualization
- **Weather Effects**: Seasonal changes and weather
- **Day/Night Cycle**: Time-based visual changes

### **Collaborative Features**
- **Cursor Sharing**: See other players' mouse positions
- **Live Annotations**: Real-time drawing and notes
- **Guided Navigation**: Follow other players' viewport
- **Collaborative Bookmarks**: Shared points of interest

### **Accessibility Enhancements**
- **Voice Commands**: Navigate map with speech
- **High Contrast Themes**: Multiple accessibility themes
- **Haptic Feedback**: Tactile responses for interactions
- **Audio Descriptions**: Spoken element descriptions

This comprehensive design system ensures that the Mappa Imperium map becomes a living, breathing visualization of the collaborative world, where every pin tells a story and every connection reveals the intricate web of relationships that players have woven together across the ages.