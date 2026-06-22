import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import ProductModal from '../components/ProductModal';
import '../WoltTheme.css';

/**
 * ProductTestPage Component
 * A fictitious page designed to showcase and test the ProductModal component.
 * Positioned as the entry point of the app for testing purposes.
 */
const ProductTestPage = () => {
    const [showModal, setShowModal] = useState(false);

    // Mock product payload from the screenshot
    const mockProduct = {
        id: "item-c0dabd8544e4268b6f7b9a91",
        name: "בוריקסה ביצה (בוריקה בתוך פריקסה)",
        price: 45.00,
        description: "פריקסה חם במילוי בוריקה עם ביצה, לימון, חריף, מטבוחה, צ'ירשי, סלט ירקות, טונה, מלפפון חמוץ, זיתים ירוקים ולימון כבוש",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=cover",
        isPopular: true
    };

    return (
        <div className="page-wrapper-home d-flex flex-column align-items-center justify-content-center text-white" style={{ minHeight: '100vh', backgroundColor: '#0A0C17' }}>
            <Container className="text-center p-5 rounded" style={{ maxWidth: '600px', background: '#1c1e27', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h1 className="mb-4 fw-bold" style={{ color: '#00c2e8' }}>Wolt Clone</h1>
                <h4 className="mb-4 text-white-50">מסך בדיקת קומפוננטת מוצר (ProductModal)</h4>
                <p className="mb-5" style={{ fontSize: '15px', color: '#8c909f', direction: 'rtl' }}>
                    לחץ על הכפתור למטה כדי לפתוח את הדיאלוג החדש ולבחון את האנימציות, כפתורי הכמויות, עיצוב ה-Dark Mode ותמיכת ה-RTL (עברית).
                </p>
                <Button 
                    onClick={() => setShowModal(true)} 
                    style={{ 
                        backgroundColor: '#00c2e8', 
                        border: 'none', 
                        color: '#0c1821', 
                        fontWeight: 'bold', 
                        padding: '12px 30px', 
                        borderRadius: '12px',
                        fontSize: '16px'
                    }}
                >
                    פתח פרטי מוצר (ProductModal)
                </Button>
            </Container>

            <ProductModal 
                show={showModal} 
                onHide={() => setShowModal(false)} 
                product={mockProduct} 
            />
        </div>
    );
};

export default ProductTestPage;
