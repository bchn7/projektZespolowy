import importlib
StorageBlob = importlib.import_module("azure.storage.blob")


class AzureStorageProvider:
    CONTAINER_NAME = 'photobook'
    ACCOUNT_NAME = 'sqlvauguulxb3vhptc'
    KEY = 'rGTh8yVuJANxTlwINPyeFrgCVah8rxmnD'

    def addBlob(self, blobName, blob):
        blobServiceClient = StorageBlob.BlockBlobService(account_name=self.ACCOUNT_NAME,
                                                         account_key=self.KEY)
        blobServiceClient.create_blob_from_bytes(container_name=self.CONTAINER_NAME, blob_name=blobName + ".jpg",
                                                 blob=blob)

    def removeBlob(self, blobName):
        blobServiceClient = StorageBlob.BlockBlobService(account_name=self.ACCOUNT_NAME,
                                                         account_key=self.KEY)
        blobServiceClient.delete_blob(container_name=self.CONTAINER_NAME, blob_name=blobName)