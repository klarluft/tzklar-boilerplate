type storage_type = int;

type action_type = 
  | SetStorage (int)
  | Increment (int);

type return_type = (list(operation), storage_type);

let set_storage = ((params, _storage): (int, storage_type)): return_type => {
  ([]: list(operation), params);
}

let increment = ((params, storage): (int, storage_type)): return_type => {
  ([]: list(operation), storage + params);
}

let main = ((action, storage): (action_type, storage_type)) : return_type => {
  switch (action) {
    | SetStorage (params) => set_storage((params, storage))
    | Increment (params) => increment((params, storage))
  };
};