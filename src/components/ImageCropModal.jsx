import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import Modal from './Modal'

// Draws the cropped region of an image onto a canvas and returns a small
// square JPEG data URL - same output shape as utils/imageResize.js, so
// callers can treat a cropped photo exactly like a resized one.
function getCroppedDataUrl(imageSrc, cropPixels, outputSize = 320) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onerror = () => reject(new Error('Could not load the image.'))
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = outputSize
      canvas.height = outputSize
      const ctx = canvas.getContext('2d')
      ctx.drawImage(
        img,
        cropPixels.x,
        cropPixels.y,
        cropPixels.width,
        cropPixels.height,
        0,
        0,
        outputSize,
        outputSize,
      )
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.src = imageSrc
  })
}

export default function ImageCropModal({ open, imageSrc, onCancel, onCropped }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleCropComplete = useCallback((_croppedArea, pixels) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const handleSave = async () => {
    if (!croppedAreaPixels) return
    setSaving(true)
    try {
      const dataUrl = await getCroppedDataUrl(imageSrc, croppedAreaPixels)
      onCropped(dataUrl)
    } catch (error) {
      console.error('Failed to crop image:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title="Crop your photo" onClose={onCancel}>
      <div className="relative w-full h-72 bg-slate-900 rounded-xl overflow-hidden">
        {imageSrc && (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        )}
      </div>

      <input
        type="range"
        min={1}
        max={3}
        step={0.05}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        className="w-full mt-3 accent-primary"
      />

      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors duration-150 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-hover transition-colors duration-150 cursor-pointer disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Use this photo'}
        </button>
      </div>
    </Modal>
  )
}
