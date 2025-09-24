import { useRef, useState } from "react";

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let i = 0, n = bytes;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(1)} ${units[i]}`;
}

function isImageFile(file) {
  if (!file) return false;
  if (file.type && file.type.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file.name);
}

export default function ImageUploader({
  label = "Archivo",
  accept = "image/*",
}) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [info, setInfo] = useState("");

  function reset() {
    setError("");
    setPreviewSrc("");
    setInfo("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleChange(e) {
    setError("");
    const file = e.target.files?.[0];
    if (!file) { reset(); return; }

    if (!isImageFile(file)) {
      reset();
      setError("El archivo debe ser una imagen válida (png, jpg, webp, etc.).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewSrc(reader.result);
      setInfo(`${file.name} — ${formatBytes(file.size)} — ${file.type || "tipo desconocido"}`);
    };
    reader.onerror = () => {
      reset();
      setError("No se pudo leer el archivo. Probá de nuevo.");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="card">
      <h1 className="title">Subir imagen y mostrarla</h1>
      <p>Elegí un archivo de imagen. Se valida con la <b>File API</b> y se muestra abajo.</p>

      <div className="row">
        <label htmlFor="fileInput"><b>{label}:</b></label>
        <input
          id="fileInput"
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
        />
        <button type="button" className="btn" onClick={reset}>Limpiar</button>
      </div>

      <p className="error" role="alert" aria-live="polite">{error}</p>

      <figure>
        {previewSrc && (
          <img
            src={previewSrc}
            alt={`Vista previa de la imagen seleccionada`}
            className="preview"
          />
        )}
        <figcaption className="info">{info}</figcaption>
      </figure>
    </div>
  );
}