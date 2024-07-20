document.getElementById('add-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch('/admin/products', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            location.reload();
        } else {
            const error = await response.json();
            alert(error.message || 'Error adding product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred');
    }
});

async function editProduct(id) {
    const product = await fetchProduct(id);
    if (!product) return;

    const form = document.getElementById('add-product-form');
    form.productName.value = product.productName;
    form.productPrice.value = product.productPrice;
    form.productCode.value = product.productCode;
    form.productDescription.value = product.productDescription;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        formData.append('currentImageUrl', product.imageUrl);

        try {
            const response = await fetch(`/admin/products/${id}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                location.reload();
            } else {
                const error = await response.json();
                alert(error.message || 'Error updating product');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred');
        }
    };
}

async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            const response = await fetch(`/admin/products/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Product deleted successfully');
                location.reload();
            } else {
                alert('Error deleting product');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred');
        }
    }
}

async function fetchProduct(id) {
    try {
        const response = await fetch(`/admin/products/${id}`);
        if (response.ok) {
            return await response.json();
        } else {
            alert('Error fetching product');
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred');
        return null;
    }
}