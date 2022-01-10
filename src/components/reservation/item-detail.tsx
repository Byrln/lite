const ItemDetail = ({ itemInfo }: any) => {
    return (
        <>
            <h4>Item Detail</h4>
            <p>{JSON.stringify(itemInfo)}</p>
        </>
    );
};

export default ItemDetail;
