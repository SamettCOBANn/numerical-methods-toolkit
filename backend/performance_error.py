"""
10. Performance & Error Handling
"""
import numpy as np
import time

def demo():
    print("[10] Performance & Error Handling")
    start = time.time()
    try:
        # Büyük matris çarpımı
        A = np.random.rand(500, 500)
        B = np.random.rand(500, 500)
        C = np.dot(A, B)
        print("Çarpım tamamlandı.")
    except Exception as e:
        print("Hata oluştu:", e)
    finally:
        print(f"Süre: {time.time() - start:.3f} sn")
