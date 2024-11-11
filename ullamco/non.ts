import React, { useState, useEffect, useCallback } from 'react';
import { firestore } from './firebase';

const ObjectList = () => {
  const [objects, setObjects] = useState([]);
  const [showObjectChanges, setShowObjectChanges] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const collectionRef = firestore.collection('objects');
    const unsubscribe = collectionRef.onSnapshot(
      querySnapshot => {
        const updatedObjects = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setObjects(updatedObjects);
        setLoading(false);
      },
      error => {
        setError(error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const toggleShowObjectChanges = useCallback(() => {
    setShowObjectChanges(prevState => !prevState);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <button onClick={toggleShowObjectChanges}>
        {showObjectChanges ? 'Disable' : 'Enable'} show object changes
      </button>
      <ul>
        {objects.map(object => (
          <li key={object.id}>
            {showObjectChanges && (
              <>
                <span>Updated at: {new Date(object.updatedAt.seconds * 1000).toLocaleString()}</span>
                <br />
              </>
            )}
            <span>{object.name}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ObjectList;
