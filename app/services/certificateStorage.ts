// Basic in-memory storage for demo 
// In a real application, I would use IPFS
class CertificateStorageService {
    private static instance: CertificateStorageService;
    private certificateMap: Map<number, string>; // tokenId -> file data URL
    
    private constructor() {
      this.certificateMap = new Map();
    }
    
    public static getInstance(): CertificateStorageService {
      if (!CertificateStorageService.instance) {
        CertificateStorageService.instance = new CertificateStorageService();
      }
      return CertificateStorageService.instance;
    }
    
    // Store certificate file
    public async storeCertificate(tokenId: number, file: File): Promise<boolean> {
      return new Promise((resolve) => {
        const reader = new FileReader();
        
        reader.onload = () => {
          const dataUrl = reader.result as string;
          this.certificateMap.set(tokenId, dataUrl);
          resolve(true);
        };
        
        reader.onerror = () => {
          console.error('Error reading file');
          resolve(false);
        };
        
        reader.readAsDataURL(file);
      });
    }
    
    // Get certificate file
    public getCertificate(tokenId: number): string | null {
      return this.certificateMap.get(tokenId) || null;
    }
    
    // Check if certificate exists
    public hasCertificate(tokenId: number): boolean {
      return this.certificateMap.has(tokenId);
    }
    
    // Remove certificate
    public removeCertificate(tokenId: number): boolean {
      return this.certificateMap.delete(tokenId);
    }
    
    // Get all certificate IDs
    public getAllCertificateIds(): number[] {
      return Array.from(this.certificateMap.keys());
    }
  }
  
  export default CertificateStorageService.getInstance();