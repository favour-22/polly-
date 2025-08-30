# QR Code Feature for Polls

## Overview

The QR code feature allows users to easily share polls by generating QR codes that link directly to poll voting pages. This makes it simple for participants to access polls by scanning the QR code with their mobile devices.

## Components

### PollQRCode Component

**Location**: `components/poll/PollQRCode.tsx`

**Props**:
- `pollId` (string, required): The unique identifier for the poll
- `pollTitle` (string, optional): The title of the poll (defaults to "Poll")
- `baseUrl` (string, optional): The base URL for the application (auto-detected)

## Features

### 1. QR Code Generation
- Uses external QR code service (QR Server API) for reliable generation
- Automatically generates QR codes for poll URLs
- Supports customizable size (128px to 512px)

### 2. URL Management
- Displays the poll URL in a read-only input field
- One-click copy to clipboard functionality
- Automatic URL generation based on poll ID

### 3. Download Functionality
- Download QR codes as PNG images
- Automatic file naming: `poll-{pollId}-qr.png`
- High-quality image output

### 4. Sharing Capabilities
- Native sharing on mobile devices (Web Share API)
- Fallback to clipboard copy on desktop
- Includes poll title and description in share data

### 5. Responsive Design
- Mobile-friendly interface
- Adjustable QR code size with visual feedback
- Clean, modern UI using existing design system

## Usage

### Basic Usage
```tsx
import PollQRCode from '@/components/poll/PollQRCode';

<PollQRCode 
  pollId="my-poll-123"
  pollTitle="Team Lunch Preferences"
/>
```

### With Custom Base URL
```tsx
<PollQRCode 
  pollId="my-poll-123"
  pollTitle="Team Lunch Preferences"
  baseUrl="https://myapp.com"
/>
```

## Demo Page

A demo page is available at `/qr-demo` to showcase the QR code functionality with sample polls.

## Technical Implementation

### QR Code Generation
- Uses QR Server API: `https://api.qrserver.com/v1/create-qr-code/`
- Parameters: size, data (URL)
- Returns PNG image

### URL Structure
Generated poll URLs follow the pattern: `{baseUrl}/poll/{pollId}`

### Browser Compatibility
- Modern browsers with Web Share API support
- Fallback clipboard functionality for older browsers
- Mobile-responsive design

## Future Enhancements

1. **Custom QR Code Styling**: Add support for custom colors and logos
2. **Analytics**: Track QR code scans and usage
3. **Batch Generation**: Generate multiple QR codes for multiple polls
4. **Offline Support**: Client-side QR code generation
5. **Custom Domains**: Support for custom poll URLs

## Dependencies

- React (for component logic)
- External QR Server API (for QR code generation)
- Browser APIs (Clipboard API, Web Share API)

## File Structure

```
components/
  poll/
    PollQRCode.tsx          # Main QR code component
app/
  qr-demo/
    page.tsx               # Demo page
docs/
  QR_CODE_FEATURE.md       # This documentation
```
