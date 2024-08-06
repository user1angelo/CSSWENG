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
        } else if (response.status === 409) { // will make sure the new product we are adding, will not share the same int 'code' with an existing product.
             alert('Product code already exists');
        } else {
            const error = await response.json();
            alert(error.message || 'Error adding product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred');
    }
});

async function openEditModal(id) {
    const product = await fetchProduct(id);
    if (!product) return;

    document.getElementById('edit-productId').value = id;
    document.getElementById('edit-productName').value = product.productName;
    document.getElementById('edit-productPrice').value = product.productPrice;
    document.getElementById('edit-productCode').value = product.productCode;
    document.getElementById('edit-productDescription').value = product.productDescription;
    document.getElementById('current-product-image').src = product.imageUrl;

    document.getElementById('editModal').style.display = 'block';
}

document.getElementById('edit-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-productId').value;
    const formData = new FormData(e.target);

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
});

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

// Close modal when clicking on <span> (x)
document.querySelector('.close').onclick = function() {
    document.getElementById('editModal').style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}