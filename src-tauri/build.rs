use std::{env, fs, path::PathBuf};

fn main() {
    let manifest_dir = env::var("CARGO_MANIFEST_DIR").expect("missing CARGO_MANIFEST_DIR");
    let manifest_dir = manifest_dir
        .strip_prefix(r"\\?\")
        .unwrap_or(&manifest_dir)
        .to_string();
    let manifest_path = PathBuf::from(&manifest_dir);

    env::set_current_dir(&manifest_path)
        .unwrap_or_else(|error| panic!("failed to switch build cwd to {manifest_path:?}: {error}"));
    let schemas_dir = manifest_path.join("gen").join("schemas");
    fs::create_dir_all(&schemas_dir)
        .unwrap_or_else(|error| panic!("failed to create {schemas_dir:?}: {error}"));

    let attributes = tauri_build::Attributes::new().app_manifest(
        tauri_build::AppManifest::new()
            .permissions_path_pattern("./permissions/app-disabled/**/*"),
    );

    tauri_build::try_build(attributes).expect("failed to run Tauri build script");
}
