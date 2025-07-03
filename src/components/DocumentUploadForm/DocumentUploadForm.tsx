import React, { useState } from "react";
import "./DocumentUploadForm.css";
import Sidebar from "../Sidebar/Sidebar";

type DocumentKey = "document1" | "document2";

const documentTypes: Record<
  DocumentKey,
  {
    label: string;
    accept: string;
    maxSize: number;
    icon: string;
  }
> = {
  document1: {
    label: "Valorización Sai de Bodegas 01,02 y 03",
    accept: ".xlsx, .xls",
    maxSize: 5 * 1024 * 1024,
    icon: "📄",
  },
  document2: {
    label: "Productos Sai",
    accept: ".xlsx, .xls",
    maxSize: 5 * 1024 * 1024,
    icon: "📄",
  },
};

interface Previews {
  [key: string]: string | null;
}

interface Documents {
  [key: string]: File | null;
}

interface UploadProgress {
  [key: string]: number;
}

const DocumentUploadForm: React.FC = () => {
  const [isOpen, setOpen] = useState(true);
  const [documents, setDocuments] = useState<Documents>({
    document1: null,
    document2: null,
    document3: null,
  });

  const [previews, setPreviews] = useState<Previews>({
    document1: null,
    document2: null,
    document3: null,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    document1: 0,
    document2: 0,
    document3: 0,
  });

  const handleFileChange = (documentKey: DocumentKey, file: File | null) => {
    if (!file) return;

    const docType = documentTypes[documentKey];

    if (file.size > docType.maxSize) {
      alert(
        `El archivo es muy grande. Máximo ${docType.maxSize / (1024 * 1024)}MB`
      );
      return;
    }

    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!docType.accept.includes(fileExtension)) {
      alert(
        `Tipo de archivo no válido. Formatos permitidos: ${docType.accept}`
      );
      return;
    }

    setDocuments((prev) => ({
      ...prev,
      [documentKey]: file,
    }));

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => ({
          ...prev,
          [documentKey]: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setPreviews((prev) => ({
        ...prev,
        [documentKey]: null,
      }));
    }
  };

  const removeDocument = (documentKey: DocumentKey) => {
    setDocuments((prev) => ({
      ...prev,
      [documentKey]: null,
    }));
    setPreviews((prev) => ({
      ...prev,
      [documentKey]: null,
    }));
    setUploadProgress((prev) => ({
      ...prev,
      [documentKey]: 0,
    }));
  };

  const simulateUpload = (documentKey: DocumentKey) => {
    return new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        setUploadProgress((prev) => ({
          ...prev,
          [documentKey]: Math.round(progress),
        }));
      }, 200);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filesToUpload = Object.entries(documents).filter(
      ([_, file]) => file !== null
    );

    if (filesToUpload.length === 0) {
      alert("Por favor selecciona al menos un documento");
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map(([key]) =>
        simulateUpload(key as DocumentKey)
      );
      await Promise.all(uploadPromises);

      alert("¡Documentos cargados exitosamente!");

      setDocuments({
        document1: null,
        document2: null,
        document3: null,
      });
      setPreviews({
        document1: null,
        document2: null,
        document3: null,
      });
      setUploadProgress({
        document1: 0,
        document2: 0,
        document3: 0,
      });
    } catch (error) {
      alert("Error al cargar documentos");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      <Sidebar isOpen={isOpen} onClose={() => setOpen((prev) => !prev)} />
      <div className="container">
        <div className="doc-upload-card">
          <h1 className="doc-upload-title">Cargar Documentos</h1>
          <p className="doc-upload-desc">
            Sube los documentos requeridos. Formatos permitidos: Excel (máx. 5MB
            cada uno)
          </p>
          <form onSubmit={handleSubmit}>
            {Object.entries(documentTypes).map(([key, docType]) => (
              <div key={key} className="doc-upload-block">
                <div className="doc-upload-label-row">
                  <span className="doc-upload-icon">{docType.icon}</span>
                  <span className="doc-upload-label">{docType.label}</span>
                  <span className="doc-upload-accept">
                    Formatos: {docType.accept}
                  </span>
                </div>
                {!documents[key] ? (
                  <div className="doc-upload-drop">
                    <input
                      type="file"
                      id={key}
                      accept={docType.accept}
                      onChange={(e) =>
                        handleFileChange(
                          key as DocumentKey,
                          e.target.files?.[0] || null
                        )
                      }
                      className="doc-upload-input"
                      disabled={uploading}
                    />
                    <label htmlFor={key} className="doc-upload-drop-label">
                      <div className="doc-upload-drop-icon">📁</div>
                      <div>Haz clic para seleccionar archivo</div>
                    </label>
                  </div>
                ) : (
                  <div className="doc-upload-preview">
                    <div className="doc-upload-preview-row">
                      <span className="doc-upload-preview-icon">
                        {documents[key]?.type.startsWith("image/")
                          ? "🖼️"
                          : "📄"}
                      </span>
                      <span>
                        <b>{documents[key]?.name}</b>
                        <span className="doc-upload-size">
                          {formatFileSize(documents[key]?.size || 0)}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeDocument(key as DocumentKey)}
                        className="doc-upload-remove"
                        disabled={uploading}
                      >
                        ❌
                      </button>
                    </div>
                    {previews[key] && (
                      <img
                        src={previews[key] as string}
                        alt="Preview"
                        className="doc-upload-img"
                      />
                    )}
                    {uploading && uploadProgress[key] > 0 && (
                      <div className="doc-upload-progress">
                        <div
                          className="doc-upload-progress-bar"
                          style={{ width: `${uploadProgress[key]}%` }}
                        ></div>
                        <span className="doc-upload-progress-text">
                          {uploadProgress[key]}%
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div className="doc-upload-actions">
              <button
                type="button"
                onClick={() => {
                  setDocuments({
                    document1: null,
                    document2: null,
                    document3: null,
                  });
                  setPreviews({
                    document1: null,
                    document2: null,
                    document3: null,
                  });
                }}
                className="doc-upload-btn doc-upload-btn-secondary"
                disabled={uploading}
              >
                Limpiar Todo
              </button>
              <button
                type="submit"
                disabled={
                  uploading ||
                  Object.values(documents).every((doc) => doc === null)
                }
                className="doc-upload-btn doc-upload-btn-primary"
              >
                {uploading ? "Subiendo..." : "Cargar Documentos"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DocumentUploadForm;
