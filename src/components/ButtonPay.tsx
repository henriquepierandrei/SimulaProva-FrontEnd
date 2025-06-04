import React, { useState } from 'react';
import { Heart, X, Coffee, Gift, Sparkles, Smartphone, Camera } from 'lucide-react';
import './ButtonPay.css';
import { AiFillRocket } from 'react-icons/ai';

type ButtonPayProps = {
  isDark: boolean;
};

function ButtonPay({ isDark }: ButtonPayProps) {
  const [showQR, setShowQR] = useState(false);
 



  const toggleQR = () => {
    setShowQR(!showQR);
  };

  return (
    <div className="donation-wrapper">
      {/* Botão Principal */}
      <button 
        className={`donate-btn ${isDark ? 'dark' : 'light'}`}
        onClick={toggleQR}
        aria-label="Contribuir com o projeto"
      >
        <div className="donate-btn__content">
          <div className="donate-btn__icon-wrapper">
            <Heart className="donate-btn__heart" />
            <div className="donate-btn__pulse"></div>
          </div>
          <span className="donate-btn__text">Contribua</span>
          <Sparkles className="donate-btn__sparkle" />
          <div className="donate-btn__glow"></div>
        </div>
      </button>

      {/* Modal com QR Code */}
      {showQR && (
        <div className="qr-backdrop" onClick={toggleQR}>
          <div className={`qr-panel ${isDark ? 'qr-panel--dark' : 'qr-panel--light'}`} onClick={(e) => e.stopPropagation()}>
            <button className="qr-panel__close" onClick={toggleQR}>
              <X size={20} />
            </button>
            
            <div className="qr-panel__header">
              <div className="qr-panel__header-icon">
                <Coffee className="qr-panel__coffee" />
              </div>
              <h3 className="qr-panel__title">Apoie nosso projeto!</h3>
              <p className="qr-panel__subtitle">Sua contribuição faz toda a diferença</p>
            </div>

            <div className="qr-panel__body">
              <div className="qr-display">
                <div className="qr-display__frame">
                  <img 
                    src="https://res.cloudinary.com/dvadwwvub/image/upload/v1749057477/qrcode-pix_vfsu2t.png" 
                    alt="QR Code PIX" 
                    className="qr-display__image"
                  />
                </div>
              </div>
              
              <div className="payment-info">
                <div className="payment-methods">
                  <div className="payment-method">
                    <Gift className="payment-method__icon" />
                    <span className="payment-method__text">PIX</span>
                  </div>
                  <div className="payment-value">
                    <span className="payment-value__text">Qualquer valor</span>
                  </div>
                </div>
                
                <div className="payment-steps">
                  <div className="payment-step">
                    <span className="payment-step__emoji"><Smartphone /></span>
                    <span className="payment-step__text">Abra seu app do banco</span>
                  </div>
                  <div className="payment-step">
                    <span className="payment-step__emoji"><Camera /></span>
                    <span className="payment-step__text">Escaneie o QR Code</span>
                  </div>
                  <div className="payment-step">
                    <span className="payment-step__emoji"><Heart /></span>
                    <span className="payment-step__text">Confirme a contribuição</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="qr-panel__footer">
              <p className="qr-panel__thanks">Obrigado pelo seu apoio! 🚀</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ButtonPay;