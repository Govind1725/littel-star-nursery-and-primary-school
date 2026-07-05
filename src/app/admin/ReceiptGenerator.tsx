'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toWords } from 'number-to-words';
import styles from './admin.module.css';
import { Trash2, Plus, Download } from 'lucide-react';

type LineItem = {
  id: string;
  desc: string;
  price: number;
};

export default function ReceiptGenerator() {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  
  const [receiptNumber, setReceiptNumber] = useState(`RCP-${new Date().getFullYear()}-0001`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', desc: 'Tuition Fee - Term 1', price: 5000 }
  ]);
  
  const [gstEnabled, setGstEnabled] = useState(false);
  const [gstRate, setGstRate] = useState(18);
  const [discount, setDiscount] = useState(0);
  
  const [notes, setNotes] = useState('Thank you for choosing Little Star Nursery.');
  
  const receiptRef = useRef<HTMLDivElement>(null);
  
  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const gstAmount = gstEnabled ? (subtotal * gstRate) / 100 : 0;
  const grandTotal = subtotal + gstAmount - discount;
  
  // Format amount to INR
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Handle number to words specifically for Indian Currency style
  const getAmountInWords = (amount: number) => {
    if (amount === 0) return 'Zero Rupees Only';
    try {
      // number-to-words gives Western formats (millions). 
      // But for simplicity we'll use it as-is, and append "Rupees Only".
      const words = toWords(amount);
      // Capitalize first letter of each word
      return words.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Rupees Only';
    } catch (e) {
      return '';
    }
  };

  const handleAddItem = () => {
    setItems([...items, { id: Math.random().toString(), desc: '', price: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const generatePDF = async () => {
    if (!receiptRef.current) return;
    
    // Temporarily override any CSS scale/zoom to ensure A4 dimensions are captured properly
    const originalTransform = receiptRef.current.style.transform;
    const originalZoom = (receiptRef.current.style as any).zoom;
    
    receiptRef.current.style.transform = 'scale(1)';
    (receiptRef.current.style as any).zoom = '1';
    
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${receiptNumber}.pdf`);
      
      // Auto-increment receipt number
      const nextReceiptNumber = receiptNumber.replace(/(\d+)$/, (match) => {
        const nextNum = parseInt(match, 10) + 1;
        return nextNum.toString().padStart(match.length, '0');
      });
      setReceiptNumber(nextReceiptNumber);
      
    } catch (error) {
      console.error('Failed to generate PDF', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      receiptRef.current.style.transform = originalTransform;
      (receiptRef.current.style as any).zoom = originalZoom;
    }
  };

  return (
    <div className={styles.receiptGenWrapper}>
      {/* LEFT COLUMN: FORM */}
      <div className={styles.receiptForm}>
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>GST Settings</h3>
            <label className={styles.toggleSwitch}>
              <input 
                type="checkbox" 
                checked={gstEnabled} 
                onChange={(e) => setGstEnabled(e.target.checked)} 
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
          <p className={styles.sectionDesc}>Enable or disable GST for this receipt.</p>
          
          {gstEnabled && (
            <div className={styles.formGroup} style={{ marginTop: '16px' }}>
              <label>GST Rate (%)</label>
              <input 
                type="number" 
                className={styles.input} 
                value={gstRate} 
                onChange={(e) => setGstRate(Number(e.target.value))} 
              />
            </div>
          )}
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Receipt Details</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Receipt Number</label>
              <input 
                type="text" 
                className={styles.input} 
                value={receiptNumber} 
                onChange={(e) => setReceiptNumber(e.target.value)} 
                autoComplete="off"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Issue Date</label>
              <input 
                type="date" 
                className={styles.input} 
                value={issueDate} 
                onChange={(e) => setIssueDate(e.target.value)} 
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Bill To</h3>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Client Name *</label>
              <input 
                type="text" 
                className={styles.input} 
                value={clientName} 
                onChange={(e) => setClientName(e.target.value)} 
                placeholder="John Doe"
                autoComplete="off"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input 
                type="email" 
                className={styles.input} 
                value={clientEmail} 
                onChange={(e) => setClientEmail(e.target.value)} 
                placeholder="john@example.com"
                autoComplete="off"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input 
                type="text" 
                className={styles.input} 
                value={clientPhone} 
                onChange={(e) => setClientPhone(e.target.value)} 
                placeholder="+91 98765 43210"
                autoComplete="off"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Address</label>
              <input 
                type="text" 
                className={styles.input} 
                value={clientAddress} 
                onChange={(e) => setClientAddress(e.target.value)} 
                placeholder="123 Tech Park, City"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Line Items</h3>
          <div className={styles.itemsList}>
            {items.map((item) => (
              <div key={item.id} className={styles.itemRow}>
                <div className={styles.itemColDesc}>
                  <label>Description</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={item.desc} 
                    onChange={(e) => handleItemChange(item.id, 'desc', e.target.value)} 
                    autoComplete="off"
                  />
                </div>
                <div className={styles.itemColPrice}>
                  <label>Price</label>
                  <input 
                    type="number" 
                    className={styles.input} 
                    value={item.price} 
                    onChange={(e) => handleItemChange(item.id, 'price', Number(e.target.value))} 
                    min="0"
                  />
                </div>
                <div className={styles.itemColAmount}>
                  <label>Amount</label>
                  <div className={styles.amountDisplay}>{formatINR(item.price)}</div>
                </div>
                <div className={styles.itemColAction}>
                  {items.length > 1 && (
                    <button 
                      className={styles.deleteItemBtn} 
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remove Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className={`btn-outline ${styles.addItemBtn}`} onClick={handleAddItem}>
            <Plus size={16} style={{ marginRight: '6px' }} /> Add Item
          </button>
          
          <div className={styles.formGroup} style={{ marginTop: '20px' }}>
            <label>Discount Amount (₹)</label>
            <input 
              type="number" 
              className={styles.input} 
              value={discount} 
              onChange={(e) => setDiscount(Number(e.target.value))} 
              min="0"
            />
          </div>
        </div>
        
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Additional Details</h3>
          <div className={styles.formGroup}>
            <label>Notes</label>
            <textarea 
              className={`${styles.input} ${styles.textarea}`} 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              rows={2}
            />
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: LIVE PREVIEW */}
      <div className={styles.receiptPreviewWrapper}>
        <div className={styles.previewToolbar}>
          <h3 className={styles.previewTitle}>Live Preview</h3>
          <button className="btn-primary" onClick={generatePDF}>
            <Download size={16} style={{ marginRight: '6px' }} /> Download PDF
          </button>
        </div>
        
        <div className={styles.receiptPaperWrapper}>
          <div className={styles.receiptPaper} ref={receiptRef}>
            {/* Receipt Header (Matching Hero Banner style) */}
            <div className={styles.receiptHeader}>
              <div className={styles.receiptBrand}>
                <div className={styles.receiptLogoPlaceholder}>
                  <img 
                    src="/images/little%20star%20logo.png" 
                    alt="School Logo" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
                <div className={styles.receiptTitles}>
                  <h1 className={styles.receiptAcademyName}>LITTLE STAR</h1>
                  <p className={styles.receiptTagline}>Nursery & Primary School | STAR KIDS Pre-School & Day Care</p>
                </div>
              </div>
              <div className={styles.receiptTitleBox}>
                <h2>RECEIPT</h2>
                <p># {receiptNumber}</p>
              </div>
            </div>
            
            <div className={styles.receiptBody}>
              <div className={styles.receiptMetaRow}>
                <div className={styles.billTo}>
                  <h4 className={styles.metaLabel}>Bill To:</h4>
                  <div className={styles.metaValueMain}>{clientName || 'Client Name'}</div>
                  {clientEmail && <div className={styles.metaValue}>{clientEmail}</div>}
                  {clientPhone && <div className={styles.metaValue}>{clientPhone}</div>}
                  {clientAddress && <div className={styles.metaValue}>{clientAddress}</div>}
                </div>
                <div className={styles.receiptDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.metaLabel}>Issue Date:</span>
                    <span className={styles.metaValue}>{issueDate}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.receiptTableWrapper}>
                <table className={styles.receiptTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '60%' }}>Description</th>
                      <th style={{ textAlign: 'right', width: '20%' }}>Price</th>
                      <th style={{ textAlign: 'right', width: '20%' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.desc || 'Item Description'}</td>
                        <td style={{ textAlign: 'right' }}>{formatINR(item.price)}</td>
                        <td style={{ textAlign: 'right' }}>{formatINR(item.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className={styles.receiptTotalsRow}>
                <div className={styles.receiptWords}>
                  {grandTotal > 0 && (
                    <>
                      <h4 className={styles.metaLabel}>Amount in Words:</h4>
                      <p className={styles.wordsText}>{getAmountInWords(grandTotal)}</p>
                    </>
                  )}
                  {notes && (
                    <div className={styles.receiptNotes}>
                      <h4 className={styles.metaLabel}>Notes:</h4>
                      <p>{notes}</p>
                    </div>
                  )}
                </div>
                
                <div className={styles.receiptTotalsBox}>
                  <div className={styles.totalRow}>
                    <span>Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  {gstEnabled && (
                    <div className={styles.totalRow}>
                      <span>GST ({gstRate}%)</span>
                      <span>{formatINR(gstAmount)}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className={styles.totalRow}>
                      <span>Discount</span>
                      <span>-{formatINR(discount)}</span>
                    </div>
                  )}
                  <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                    <span>Total Amount</span>
                    <span>{formatINR(grandTotal)}</span>
                  </div>
                </div>
              </div>
              
            </div>
            
            <div className={styles.receiptFooter}>
              <div>+91 99412 94084</div>
              <div>littlestarnpschoolnerkundram@gmail.com</div>
              <div>No.2 Anna main road, Jayalakshmi Nagar, Nerkundram</div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
