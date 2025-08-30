import PollQRCode from '@/components/poll/PollQRCode';

export default function QRDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">QR Code Demo</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sample Poll 1 */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Sample Poll 1</h2>
              <PollQRCode 
                pollId="sample-poll-1"
                pollTitle="What's your favorite programming language?"
              />
            </div>

            {/* Sample Poll 2 */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Sample Poll 2</h2>
              <PollQRCode 
                pollId="sample-poll-2"
                pollTitle="Team lunch preferences"
              />
            </div>
          </div>

          <div className="mt-12 p-6 bg-white rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Generate QR codes for any poll URL</li>
              <li>• Adjustable QR code size (128px to 512px)</li>
              <li>• Copy poll URL to clipboard</li>
              <li>• Download QR code as PNG image</li>
              <li>• Native sharing on mobile devices</li>
              <li>• Responsive design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
