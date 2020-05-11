# Add repo
helm repo add appscode https://charts.appscode.com/stable/

# Update repo
helm repo update

# Install operator
helm upgrade --install kubedb-operator appscode/kubedb

# Finish installing operator first
echo 'Waiting for kubedb-operator to be installed'
sleep 2m

# Install kubedb catalog
helm upgrade --install kubedb-catalog appscode/kubedb-catalog
