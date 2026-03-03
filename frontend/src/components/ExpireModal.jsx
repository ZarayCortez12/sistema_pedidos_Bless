import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import cierre_sesion from "../images/imagen-cierre-sesion.png";

function ExpireModal({ onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          display: "flex",
          alignItems: "center",
          width: "600px",
        }}
      >
        <img
          src={cierre_sesion}
          alt="Icono de sesión"
          style={{
            width: "250px",
            height: "250px",
            objectFit: "cover",
            borderRadius: "8px",
            marginRight: "15px",
          }}
        />

        <div style={{ textAlign: "left", flex: 1 }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Sesión por expirar
          </h2>
          <p style={{ marginBottom: "24px" }}>
            Tu sesión esta proxima a vencer, por favor vuelva a iniciar sesión para seguir realizando acciones en el sistema
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "16px",
            }}
          >
            <button
              onClick={onConfirm}
              style={{
                backgroundColor: "#e10318",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Extender Sesión
            </button>
            <button
              onClick={onCancel}
              style={{
                backgroundColor: "#E5E7EB",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpireModal;
